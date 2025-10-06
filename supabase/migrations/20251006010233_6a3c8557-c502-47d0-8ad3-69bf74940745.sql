-- Criar enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('coordenador', 'visualizador');

-- Criar tabela de roles de usuário
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário tem uma role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Política para usuários verem suas próprias roles
CREATE POLICY "Usuários podem ver suas próprias roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Política para coordenadores gerenciarem roles
CREATE POLICY "Coordenadores podem gerenciar roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'coordenador'))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'));

-- Criar novo enum graduacao_militar
CREATE TYPE graduacao_militar_new AS ENUM (
  'Brigadeiro',
  'Coronel',
  'Capitão de Mar e Guerra',
  'Tenente Coronel',
  'Capitão de Fragata',
  'Major',
  'Capitão Tenente',
  'Capitão',
  'Primeiro Tenente',
  'Tenente',
  'Segundo Tenente',
  'Alferes',
  'Guarda Marinha',
  'Aspirante',
  'Sargento Mor',
  'Sargento Chefe',
  'Sargento Ajudante',
  'Primeiro Sargento',
  'Segundo Sargento',
  'Furriel',
  'Primeiro Subsargento',
  'Segundo Furriel',
  'Subsargento',
  'Cabo de Seção',
  'Cabo',
  'Segundo Cabo',
  'Segundo Marinheiro',
  'Soldado',
  'Grumete'
);

-- Atualizar coluna graduacao com conversão de valores
ALTER TABLE public.alunos 
  ALTER COLUMN graduacao TYPE graduacao_militar_new 
  USING (
    CASE graduacao::text
      WHEN 'Subtenente' THEN 'Subsargento'::graduacao_militar_new
      WHEN 'Tenente-Coronel' THEN 'Tenente Coronel'::graduacao_militar_new
      ELSE graduacao::text::graduacao_militar_new
    END
  );

-- Remover tipo antigo e renomear novo
DROP TYPE graduacao_militar;
ALTER TYPE graduacao_militar_new RENAME TO graduacao_militar;

-- Criar enum para status do aluno
CREATE TYPE public.status_aluno AS ENUM ('Aprovado', 'Reprovado', 'Desligado', 'Cursando');

-- Adicionar campo status
ALTER TABLE public.alunos
ADD COLUMN status status_aluno DEFAULT 'Cursando';

-- Função para atribuir role ao novo usuário
CREATE OR REPLACE FUNCTION public.handle_first_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'coordenador') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'coordenador');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'visualizador');
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger para atribuir role ao novo usuário
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_first_user_role();