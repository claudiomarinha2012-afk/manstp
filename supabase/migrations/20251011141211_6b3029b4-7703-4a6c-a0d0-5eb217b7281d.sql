-- Remove a coluna status da tabela alunos
ALTER TABLE public.alunos DROP COLUMN IF EXISTS status;

-- Adiciona a coluna status na tabela turmas
ALTER TABLE public.turmas ADD COLUMN IF NOT EXISTS status status_aluno DEFAULT 'Cursando';

-- Atualiza o enum tipo_militar para incluir "Exercito" e "Bombeiro"
ALTER TYPE tipo_militar ADD VALUE IF NOT EXISTS 'Exercito';
ALTER TYPE tipo_militar ADD VALUE IF NOT EXISTS 'Bombeiro';