-- Adicionar campo para foto do aluno
ALTER TABLE public.alunos 
ADD COLUMN IF NOT EXISTS foto_url text;

COMMENT ON COLUMN public.alunos.foto_url IS 'URL da foto 3x4 do aluno armazenada no storage';

-- Criar bucket para fotos de alunos se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aluno-fotos',
  'aluno-fotos',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket de fotos
CREATE POLICY "Coordenadores podem fazer upload de fotos de alunos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'aluno-fotos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'coordenador'::app_role)
);

CREATE POLICY "Todos podem ver fotos de alunos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'aluno-fotos');

CREATE POLICY "Coordenadores podem atualizar fotos de alunos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'aluno-fotos'
  AND has_role(auth.uid(), 'coordenador'::app_role)
);

CREATE POLICY "Coordenadores podem deletar fotos de alunos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'aluno-fotos'
  AND has_role(auth.uid(), 'coordenador'::app_role)
);