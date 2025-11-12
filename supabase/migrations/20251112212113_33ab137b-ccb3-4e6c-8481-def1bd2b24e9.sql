-- Criar tabela de presenças
CREATE TABLE IF NOT EXISTS public.presencas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT true,
  observacao TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(turma_id, aluno_id, data)
);

-- Habilitar RLS
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Coordenadores podem inserir presenças"
  ON public.presencas
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem atualizar presenças"
  ON public.presencas
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'coordenador'::app_role))
  WITH CHECK (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Coordenadores podem deletar presenças"
  ON public.presencas
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'coordenador'::app_role));

CREATE POLICY "Todos podem ver presenças"
  ON public.presencas
  FOR SELECT
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_presencas_updated_at
  BEFORE UPDATE ON public.presencas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_presencas_turma_id ON public.presencas(turma_id);
CREATE INDEX idx_presencas_aluno_id ON public.presencas(aluno_id);
CREATE INDEX idx_presencas_data ON public.presencas(data);

-- Comentários
COMMENT ON TABLE public.presencas IS 'Registro de presenças dos alunos nas turmas';
COMMENT ON COLUMN public.presencas.presente IS 'true = presente, false = ausente';
COMMENT ON COLUMN public.presencas.observacao IS 'Observações sobre a presença/ausência';