-- Criar tabela de disciplinas
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id UUID NOT NULL,
  nome TEXT NOT NULL,
  carga_horaria INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de grade de aulas
CREATE TABLE IF NOT EXISTS public.grade_aulas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id UUID NOT NULL,
  dia_semana TEXT NOT NULL,
  aula_numero INTEGER NOT NULL,
  disciplina TEXT,
  professor TEXT,
  sala TEXT,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(turma_id, dia_semana, aula_numero)
);

-- Habilitar RLS
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_aulas ENABLE ROW LEVEL SECURITY;

-- Policies para disciplinas
CREATE POLICY "Todos podem ver disciplinas"
ON public.disciplinas FOR SELECT
USING (true);

CREATE POLICY "Coordenadores podem inserir disciplinas"
ON public.disciplinas FOR INSERT
WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem atualizar disciplinas"
ON public.disciplinas FOR UPDATE
USING (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem deletar disciplinas"
ON public.disciplinas FOR DELETE
USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Policies para grade_aulas
CREATE POLICY "Todos podem ver grade de aulas"
ON public.grade_aulas FOR SELECT
USING (true);

CREATE POLICY "Coordenadores podem inserir grade de aulas"
ON public.grade_aulas FOR INSERT
WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem atualizar grade de aulas"
ON public.grade_aulas FOR UPDATE
USING (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem deletar grade de aulas"
ON public.grade_aulas FOR DELETE
USING (has_role(auth.uid(), 'coordenador'::app_role));

-- Triggers para updated_at
CREATE TRIGGER update_disciplinas_updated_at
BEFORE UPDATE ON public.disciplinas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grade_aulas_updated_at
BEFORE UPDATE ON public.grade_aulas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();