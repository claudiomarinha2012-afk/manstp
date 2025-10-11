-- Phase 1: Fix RLS Policies to enforce role-based access control

-- Drop existing overly permissive policies and create role-based ones

-- ALUNOS TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os alunos" ON public.alunos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir alunos" ON public.alunos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar alunos" ON public.alunos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar alunos" ON public.alunos;

CREATE POLICY "Todos podem ver alunos"
ON public.alunos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir alunos"
ON public.alunos FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem atualizar alunos"
ON public.alunos FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar alunos"
ON public.alunos FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- INSTRUTORES TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os instrutores" ON public.instrutores;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir instrutores" ON public.instrutores;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar instrutores" ON public.instrutores;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar instrutores" ON public.instrutores;

CREATE POLICY "Todos podem ver instrutores"
ON public.instrutores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir instrutores"
ON public.instrutores FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem atualizar instrutores"
ON public.instrutores FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar instrutores"
ON public.instrutores FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- CURSOS TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os cursos" ON public.cursos;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir cursos" ON public.cursos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar cursos" ON public.cursos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar cursos" ON public.cursos;

CREATE POLICY "Todos podem ver cursos"
ON public.cursos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir cursos"
ON public.cursos FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem atualizar cursos"
ON public.cursos FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar cursos"
ON public.cursos FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- TURMAS TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todas as turmas" ON public.turmas;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir turmas" ON public.turmas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar turmas" ON public.turmas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar turmas" ON public.turmas;

CREATE POLICY "Todos podem ver turmas"
ON public.turmas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir turmas"
ON public.turmas FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem atualizar turmas"
ON public.turmas FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar turmas"
ON public.turmas FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- DOCUMENTOS_CURSO TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os documentos" ON public.documentos_curso;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir documentos" ON public.documentos_curso;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar documentos" ON public.documentos_curso;

CREATE POLICY "Todos podem ver documentos"
ON public.documentos_curso FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir documentos"
ON public.documentos_curso FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar documentos"
ON public.documentos_curso FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- ALUNO_TURMA TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os vínculos aluno-turma" ON public.aluno_turma;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir vínculos aluno-turma" ON public.aluno_turma;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar vínculos aluno-turma" ON public.aluno_turma;

CREATE POLICY "Todos podem ver vínculos aluno-turma"
ON public.aluno_turma FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir vínculos aluno-turma"
ON public.aluno_turma FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar vínculos aluno-turma"
ON public.aluno_turma FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- ALUNO_CURSO TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os vínculos aluno-curso" ON public.aluno_curso;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir vínculos aluno-curso" ON public.aluno_curso;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar vínculos aluno-curso" ON public.aluno_curso;

CREATE POLICY "Todos podem ver vínculos aluno-curso"
ON public.aluno_curso FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir vínculos aluno-curso"
ON public.aluno_curso FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar vínculos aluno-curso"
ON public.aluno_curso FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));

-- INSTRUTOR_TURMA TABLE
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os vínculos instrutor-t" ON public.instrutor_turma;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir vínculos instrutor-turma" ON public.instrutor_turma;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar vínculos instrutor-turma" ON public.instrutor_turma;

CREATE POLICY "Todos podem ver vínculos instrutor-turma"
ON public.instrutor_turma FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coordenadores podem inserir vínculos instrutor-turma"
ON public.instrutor_turma FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'coordenador'));

CREATE POLICY "Coordenadores podem deletar vínculos instrutor-turma"
ON public.instrutor_turma FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'coordenador'));