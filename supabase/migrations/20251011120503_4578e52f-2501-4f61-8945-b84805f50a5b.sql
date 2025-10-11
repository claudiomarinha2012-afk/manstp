-- Add data_inicio and data_fim columns to turmas table
ALTER TABLE public.turmas 
ADD COLUMN IF NOT EXISTS data_inicio date,
ADD COLUMN IF NOT EXISTS data_fim date;