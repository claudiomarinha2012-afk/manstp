-- Atualizar a tabela grade_aulas para usar horário em vez de aula_numero

-- Primeiro, remover a constraint antiga se existir
ALTER TABLE grade_aulas DROP CONSTRAINT IF EXISTS grade_aulas_turma_id_dia_semana_aula_numero_key;

-- Adicionar a coluna horario se não existir (com valor padrão temporário)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'grade_aulas' AND column_name = 'horario') THEN
    ALTER TABLE grade_aulas ADD COLUMN horario TEXT;
  END IF;
END $$;

-- Migrar dados de aula_numero para horario se ainda não foi feito
UPDATE grade_aulas 
SET horario = CASE aula_numero
  WHEN 1 THEN '07:00 às 11:55'
  WHEN 2 THEN '07:00 às 12:00'
  WHEN 3 THEN '08:00 às 12:00'
  WHEN 4 THEN '12:00 às 13:00'
  WHEN 5 THEN '13:00 às 18:30'
  WHEN 6 THEN '13:00 às 18:35'
  WHEN 7 THEN '18:00 às 21:00'
  WHEN 8 THEN '19:00 às 21:40'
  ELSE '07:00 às 11:55'
END
WHERE horario IS NULL;

-- Remover duplicatas, mantendo apenas o registro mais recente de cada combinação turma/dia/horario
DELETE FROM grade_aulas a
USING grade_aulas b
WHERE a.id < b.id
  AND a.turma_id = b.turma_id
  AND a.dia_semana = b.dia_semana
  AND a.horario = b.horario;

-- Tornar horario NOT NULL
ALTER TABLE grade_aulas ALTER COLUMN horario SET NOT NULL;

-- Criar constraint única para turma_id, dia_semana, horario
ALTER TABLE grade_aulas DROP CONSTRAINT IF EXISTS grade_aulas_turma_id_dia_semana_horario_key;
ALTER TABLE grade_aulas ADD CONSTRAINT grade_aulas_turma_id_dia_semana_horario_key 
  UNIQUE (turma_id, dia_semana, horario);

-- Remover as colunas antigas
ALTER TABLE grade_aulas DROP COLUMN IF EXISTS aula_numero;
ALTER TABLE grade_aulas DROP COLUMN IF EXISTS observacao;