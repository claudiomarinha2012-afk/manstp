-- Remove a coluna status da tabela turmas
ALTER TABLE public.turmas DROP COLUMN IF EXISTS status;

-- Adiciona a coluna status na tabela aluno_turma
ALTER TABLE public.aluno_turma ADD COLUMN IF NOT EXISTS status status_aluno DEFAULT 'Cursando';