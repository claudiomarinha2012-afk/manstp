-- Atualizar registros existentes de 'Guarda Costeiro' para 'Marinheiro'
UPDATE alunos 
SET tipo_militar = 'Marinheiro'::tipo_militar 
WHERE tipo_militar = 'Guarda Costeiro'::tipo_militar;

UPDATE instrutores 
SET tipo_militar = 'Marinheiro'::tipo_militar 
WHERE tipo_militar = 'Guarda Costeiro'::tipo_militar;

UPDATE turmas 
SET tipo_militar = 'Marinheiro'::tipo_militar 
WHERE tipo_militar = 'Guarda Costeiro'::tipo_militar;