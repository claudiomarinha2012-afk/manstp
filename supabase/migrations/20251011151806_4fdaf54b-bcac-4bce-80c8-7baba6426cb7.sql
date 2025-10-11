-- Modificar a função para ler a role dos metadados do usuário
CREATE OR REPLACE FUNCTION public.handle_first_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  desired_role app_role;
BEGIN
  -- Tenta ler a role dos metadados do usuário
  desired_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'visualizador'::app_role
  );
  
  -- Se não existir nenhum coordenador, o primeiro usuário vira coordenador
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'coordenador') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'coordenador');
  ELSE
    -- Caso contrário, usa a role especificada nos metadados
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, desired_role);
  END IF;
  
  RETURN NEW;
END;
$function$;