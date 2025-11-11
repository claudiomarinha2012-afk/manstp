-- Enhance RLS policies to prevent client-side authorization bypass
-- Add WITH CHECK clauses to UPDATE policies for server-side enforcement

-- Alunos table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar alunos" ON public.alunos;
CREATE POLICY "Coordenadores podem atualizar alunos"
ON public.alunos FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Instrutores table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar instrutores" ON public.instrutores;
CREATE POLICY "Coordenadores podem atualizar instrutores"
ON public.instrutores FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Turmas table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar turmas" ON public.turmas;
CREATE POLICY "Coordenadores podem atualizar turmas"
ON public.turmas FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Cursos table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar cursos" ON public.cursos;
CREATE POLICY "Coordenadores podem atualizar cursos"
ON public.cursos FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Disciplinas table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar disciplinas" ON public.disciplinas;
CREATE POLICY "Coordenadores podem atualizar disciplinas"
ON public.disciplinas FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Notas table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar notas" ON public.notas;
CREATE POLICY "Coordenadores podem atualizar notas"
ON public.notas FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Grade de aulas table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar grade de aulas" ON public.grade_aulas;
CREATE POLICY "Coordenadores podem atualizar grade de aulas"
ON public.grade_aulas FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Grade semanal table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar grade semanal" ON public.grade_semana;
CREATE POLICY "Coordenadores podem atualizar grade semanal"
ON public.grade_semana FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Certificate templates table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar templates" ON public.certificate_templates;
CREATE POLICY "Coordenadores podem atualizar templates"
ON public.certificate_templates FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));

-- Student certificates table - ensure only coordenadores can update
DROP POLICY IF EXISTS "Coordenadores podem atualizar certificados" ON public.student_certificates;
CREATE POLICY "Coordenadores podem atualizar certificados"
ON public.student_certificates FOR UPDATE
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));