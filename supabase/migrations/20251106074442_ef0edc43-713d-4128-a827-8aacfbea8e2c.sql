-- Criar tabela para armazenar templates de certificados
CREATE TABLE IF NOT EXISTS public.certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  thumbnail TEXT,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  orientation TEXT NOT NULL DEFAULT 'landscape',
  background_image TEXT,
  elements JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para armazenar certificados gerados por aluno
CREATE TABLE IF NOT EXISTS public.student_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.certificate_templates(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  pdf_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(template_id, aluno_id)
);

-- Enable RLS
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certificates ENABLE ROW LEVEL SECURITY;

-- Policies para certificate_templates
CREATE POLICY "Usuários podem ver todos os templates"
  ON public.certificate_templates FOR SELECT
  USING (true);

CREATE POLICY "Coordenadores podem inserir templates"
  ON public.certificate_templates FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem atualizar templates"
  ON public.certificate_templates FOR UPDATE
  USING (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem deletar templates"
  ON public.certificate_templates FOR DELETE
  USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Policies para student_certificates
CREATE POLICY "Usuários podem ver todos os certificados"
  ON public.student_certificates FOR SELECT
  USING (true);

CREATE POLICY "Coordenadores podem inserir certificados"
  ON public.student_certificates FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem atualizar certificados"
  ON public.student_certificates FOR UPDATE
  USING (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem deletar certificados"
  ON public.student_certificates FOR DELETE
  USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_certificate_templates_updated_at
  BEFORE UPDATE ON public.certificate_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_certificate_templates_turma_id ON public.certificate_templates(turma_id);
CREATE INDEX idx_student_certificates_aluno_id ON public.student_certificates(aluno_id);
CREATE INDEX idx_student_certificates_turma_id ON public.student_certificates(turma_id);
CREATE INDEX idx_student_certificates_template_id ON public.student_certificates(template_id);