-- Criar enum para graduações militares
CREATE TYPE public.graduacao_militar AS ENUM (
  'Soldado',
  'Cabo',
  'Terceiro Sargento',
  'Segundo Sargento',
  'Primeiro Sargento',
  'Subtenente',
  'Aspirante',
  'Segundo Tenente',
  'Primeiro Tenente',
  'Capitão',
  'Major',
  'Tenente Coronel',
  'Coronel'
);

-- Criar enum para tipo militar
CREATE TYPE public.tipo_militar AS ENUM (
  'Fuzileiro Naval',
  'Não Fuzileiro'
);

-- Criar enum para situação do curso
CREATE TYPE public.situacao_curso AS ENUM (
  'Em Andamento',
  'Concluído',
  'Cancelado'
);

-- Tabela de perfis de usuários (admin do sistema)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo)
  VALUES (new.id, new.raw_user_meta_data->>'nome_completo');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela de Alunos
CREATE TABLE public.alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT NOT NULL,
  graduacao graduacao_militar NOT NULL,
  tipo_militar tipo_militar NOT NULL,
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todos os alunos"
  ON public.alunos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir alunos"
  ON public.alunos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem atualizar alunos"
  ON public.alunos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar alunos"
  ON public.alunos FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de Cursos
CREATE TABLE public.cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  instituicao TEXT,
  data_inicio DATE,
  data_fim DATE,
  situacao situacao_curso DEFAULT 'Em Andamento',
  categoria TEXT,
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todos os cursos"
  ON public.cursos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir cursos"
  ON public.cursos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem atualizar cursos"
  ON public.cursos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar cursos"
  ON public.cursos FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de Turmas
CREATE TABLE public.turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE NOT NULL,
  ano INTEGER NOT NULL,
  tipo_militar tipo_militar NOT NULL,
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todas as turmas"
  ON public.turmas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir turmas"
  ON public.turmas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem atualizar turmas"
  ON public.turmas FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar turmas"
  ON public.turmas FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de relacionamento Aluno-Curso
CREATE TABLE public.aluno_curso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.alunos(id) ON DELETE CASCADE NOT NULL,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, curso_id)
);

ALTER TABLE public.aluno_curso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todos os vínculos aluno-curso"
  ON public.aluno_curso FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir vínculos aluno-curso"
  ON public.aluno_curso FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar vínculos aluno-curso"
  ON public.aluno_curso FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de relacionamento Aluno-Turma
CREATE TABLE public.aluno_turma (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.alunos(id) ON DELETE CASCADE NOT NULL,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, turma_id)
);

ALTER TABLE public.aluno_turma ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todos os vínculos aluno-turma"
  ON public.aluno_turma FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir vínculos aluno-turma"
  ON public.aluno_turma FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar vínculos aluno-turma"
  ON public.aluno_turma FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de Documentos dos Cursos
CREATE TABLE public.documentos_curso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE NOT NULL,
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.documentos_curso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver todos os documentos"
  ON public.documentos_curso FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir documentos"
  ON public.documentos_curso FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar documentos"
  ON public.documentos_curso FOR DELETE
  TO authenticated
  USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_alunos_updated_at
  BEFORE UPDATE ON public.alunos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at
  BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_turmas_updated_at
  BEFORE UPDATE ON public.turmas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhorar performance
CREATE INDEX idx_alunos_graduacao ON public.alunos(graduacao);
CREATE INDEX idx_alunos_tipo_militar ON public.alunos(tipo_militar);
CREATE INDEX idx_cursos_situacao ON public.cursos(situacao);
CREATE INDEX idx_turmas_ano ON public.turmas(ano);
CREATE INDEX idx_turmas_curso_id ON public.turmas(curso_id);
CREATE INDEX idx_aluno_curso_aluno_id ON public.aluno_curso(aluno_id);
CREATE INDEX idx_aluno_curso_curso_id ON public.aluno_curso(curso_id);
CREATE INDEX idx_aluno_turma_aluno_id ON public.aluno_turma(aluno_id);
CREATE INDEX idx_aluno_turma_turma_id ON public.aluno_turma(turma_id);