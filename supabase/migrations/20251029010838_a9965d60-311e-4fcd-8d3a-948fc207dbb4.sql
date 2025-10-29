-- Atualizar constraint da tabela notas para aceitar notas até 20
ALTER TABLE public.notas 
DROP CONSTRAINT IF EXISTS notas_nota_check;

ALTER TABLE public.notas 
ADD CONSTRAINT notas_nota_check CHECK (nota >= 0 AND nota <= 20);