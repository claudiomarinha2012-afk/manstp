-- Criar enum para tipos de ação
CREATE TYPE public.audit_action AS ENUM ('login', 'insert', 'update', 'delete');

-- Criar tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT,
  action_type audit_action NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Coordenadores podem ver todos os logs
CREATE POLICY "Coordenadores podem ver todos os logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Coordenadores podem deletar logs (limpar histórico)
CREATE POLICY "Coordenadores podem deletar logs"
ON public.audit_logs
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Sistema pode inserir logs
CREATE POLICY "Sistema pode inserir logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Função para registrar modificações
CREATE OR REPLACE FUNCTION public.log_modifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_action audit_action;
BEGIN
  -- Pegar informações do usuário
  v_user_id := auth.uid();
  
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = v_user_id;

  -- Determinar o tipo de ação
  IF TG_OP = 'INSERT' THEN
    v_action := 'insert';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, new_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, old_data, new_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, old_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Adicionar triggers nas tabelas principais
CREATE TRIGGER audit_alunos
AFTER INSERT OR UPDATE OR DELETE ON public.alunos
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_instrutores
AFTER INSERT OR UPDATE OR DELETE ON public.instrutores
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_cursos
AFTER INSERT OR UPDATE OR DELETE ON public.cursos
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_turmas
AFTER INSERT OR UPDATE OR DELETE ON public.turmas
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_aluno_turma
AFTER INSERT OR UPDATE OR DELETE ON public.aluno_turma
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_instrutor_turma
AFTER INSERT OR UPDATE OR DELETE ON public.instrutor_turma
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();

CREATE TRIGGER audit_user_roles
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_modifications();