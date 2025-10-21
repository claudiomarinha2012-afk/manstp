-- Adicionar novas colunas ao relacionamento aluno_turma
ALTER TABLE aluno_turma
ADD COLUMN IF NOT EXISTS local_curso TEXT,
ADD COLUMN IF NOT EXISTS sigla_curso TEXT;

-- Atualizar valores ENAPORT para EMAP em cursos
UPDATE cursos 
SET nome = REPLACE(nome, 'ENAPORT', 'EMAP')
WHERE nome LIKE '%ENAPORT%';

UPDATE cursos 
SET instituicao = REPLACE(instituicao, 'ENAPORT', 'EMAP')
WHERE instituicao LIKE '%ENAPORT%';

-- Adicionar o novo valor ao enum
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'Marinheiro' 
    AND enumtypid = 'tipo_militar'::regtype
  ) THEN
    ALTER TYPE tipo_militar ADD VALUE 'Marinheiro';
  END IF;
END $$;

-- Criar índice para melhorar performance na busca de duplicados
CREATE INDEX IF NOT EXISTS idx_alunos_nome_completo ON alunos(LOWER(nome_completo));
CREATE INDEX IF NOT EXISTS idx_alunos_email ON alunos(LOWER(email)) WHERE email IS NOT NULL;