-- Remove a política restritiva atual
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;

-- Cria nova política permitindo que todos os usuários autenticados vejam todos os perfis
CREATE POLICY "Todos os usuários podem ver perfis"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);