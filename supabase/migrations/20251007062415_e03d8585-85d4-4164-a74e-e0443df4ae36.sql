-- Criar tabela de instrutores
CREATE TABLE public.instrutores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  nome_completo TEXT NOT NULL,
  graduacao graduacao_militar NOT NULL,
  tipo_militar tipo_militar NOT NULL,
  especialidade TEXT,
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela instrutores
ALTER TABLE public.instrutores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para instrutores
CREATE POLICY "Usuários autenticados podem ver todos os instrutores"
ON public.instrutores
FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem inserir instrutores"
ON public.instrutores
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem atualizar instrutores"
ON public.instrutores
FOR UPDATE
USING (true);

CREATE POLICY "Usuários autenticados podem deletar instrutores"
ON public.instrutores
FOR DELETE
USING (true);

-- Criar tabela de vínculo instrutor-turma
CREATE TABLE public.instrutor_turma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrutor_id UUID NOT NULL REFERENCES public.instrutores(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (instrutor_id, turma_id)
);

-- Habilitar RLS na tabela instrutor_turma
ALTER TABLE public.instrutor_turma ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para instrutor_turma
CREATE POLICY "Usuários autenticados podem ver todos os vínculos instrutor-turma"
ON public.instrutor_turma
FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem inserir vínculos instrutor-turma"
ON public.instrutor_turma
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar vínculos instrutor-turma"
ON public.instrutor_turma
FOR DELETE
USING (true);

-- Trigger para atualizar updated_at em instrutores
CREATE TRIGGER update_instrutores_updated_at
  BEFORE UPDATE ON public.instrutores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();