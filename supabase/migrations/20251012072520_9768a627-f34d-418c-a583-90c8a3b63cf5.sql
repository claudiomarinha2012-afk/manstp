-- Adicionar a graduação "Suboficial" ao enum graduacao_militar
ALTER TYPE graduacao_militar ADD VALUE IF NOT EXISTS 'Suboficial';