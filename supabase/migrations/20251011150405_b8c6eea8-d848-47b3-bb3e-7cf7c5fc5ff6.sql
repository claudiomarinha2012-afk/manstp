-- Sincronizar emails existentes dos usuários da tabela auth.users para profiles
DO $$
DECLARE
  auth_user RECORD;
BEGIN
  FOR auth_user IN 
    SELECT id, email FROM auth.users
  LOOP
    UPDATE public.profiles 
    SET email = auth_user.email 
    WHERE id = auth_user.id AND (email IS NULL OR email = '');
  END LOOP;
END $$;