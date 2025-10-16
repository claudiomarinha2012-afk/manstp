-- Adicionar "Desertor" ao enum status_aluno e renomear "Aprovado" para "Concluído"

-- Criar novo enum com os valores atualizados
CREATE TYPE status_aluno_new AS ENUM ('Cursando', 'Concluído', 'Reprovado', 'Desligado', 'Desertor');

-- Atualizar registros NULL para 'Cursando'
UPDATE aluno_turma SET status = 'Cursando' WHERE status IS NULL;

-- Remover o default temporariamente
ALTER TABLE aluno_turma ALTER COLUMN status DROP DEFAULT;

-- Converter a coluna para usar o novo enum
ALTER TABLE aluno_turma 
  ALTER COLUMN status TYPE status_aluno_new 
  USING (
    CASE 
      WHEN status::text = 'Aprovado' THEN 'Concluído'::status_aluno_new
      WHEN status::text = 'Cursando' THEN 'Cursando'::status_aluno_new
      WHEN status::text = 'Reprovado' THEN 'Reprovado'::status_aluno_new
      WHEN status::text = 'Desligado' THEN 'Desligado'::status_aluno_new
      ELSE 'Cursando'::status_aluno_new
    END
  );

-- Definir novo default
ALTER TABLE aluno_turma ALTER COLUMN status SET DEFAULT 'Cursando'::status_aluno_new;

-- Remover enum antigo e renomear o novo
DROP TYPE status_aluno;
ALTER TYPE status_aluno_new RENAME TO status_aluno;