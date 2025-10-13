-- Atualizar função log_modifications para adicionar search_path
CREATE OR REPLACE FUNCTION public.log_modifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_action audit_action;
BEGIN
  -- Pegar informações do usuário (pode ser NULL para operações do sistema)
  v_user_id := auth.uid();
  
  IF v_user_id IS NOT NULL THEN
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = v_user_id;
  ELSE
    v_user_email := 'system';
  END IF;

  -- Determinar o tipo de ação
  IF TG_OP = 'INSERT' THEN
    v_action := 'insert';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, new_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, old_data, new_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    INSERT INTO public.audit_logs (user_id, user_email, action_type, table_name, record_id, old_data)
    VALUES (v_user_id, v_user_email, v_action, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Atualizar função update_updated_at_column para adicionar search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;