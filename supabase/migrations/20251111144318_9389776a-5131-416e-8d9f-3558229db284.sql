-- Criar tabela de convites para sistema de registro por convite
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'visualizador'::app_role,
  used boolean NOT NULL DEFAULT false,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  used_at timestamp with time zone,
  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Habilitar RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Política: Coordenadores podem ver todos os convites
CREATE POLICY "Coordenadores podem ver convites"
ON public.invitations FOR SELECT
USING (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Política: Coordenadores podem criar convites
CREATE POLICY "Coordenadores podem criar convites"
ON public.invitations FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'coordenador'::app_role) 
  AND invited_by = auth.uid()
);

-- Política: Sistema pode atualizar convites (marcar como usado)
CREATE POLICY "Sistema pode atualizar convites usados"
ON public.invitations FOR UPDATE
USING (true)
WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_invitations_token ON public.invitations(token) WHERE NOT used;
CREATE INDEX idx_invitations_email ON public.invitations(email);
CREATE INDEX idx_invitations_expires ON public.invitations(expires_at) WHERE NOT used;

-- Função para limpar convites expirados automaticamente
CREATE OR REPLACE FUNCTION public.cleanup_expired_invitations()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.invitations 
  WHERE expires_at < now() AND NOT used;
$$;

-- Comentários na tabela
COMMENT ON TABLE public.invitations IS 'Armazena convites únicos enviados por coordenadores para novos usuários se registrarem';
COMMENT ON COLUMN public.invitations.token IS 'Token único e seguro usado na URL do convite';
COMMENT ON COLUMN public.invitations.used IS 'Indica se o convite já foi utilizado para registro';
COMMENT ON COLUMN public.invitations.expires_at IS 'Data de expiração do convite (padrão: 7 dias)';