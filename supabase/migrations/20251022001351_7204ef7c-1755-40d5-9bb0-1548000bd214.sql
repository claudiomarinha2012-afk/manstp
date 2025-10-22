-- Add data_duracao_curso column to aluno_turma table
ALTER TABLE public.aluno_turma
ADD COLUMN data_duracao_curso DATE;

COMMENT ON COLUMN public.aluno_turma.data_duracao_curso IS 'Data de duração do curso para este aluno específico';