-- Fix appearance_settings policy to use has_role() security definer function
-- This makes it consistent with all other policies and prevents potential RLS issues

DROP POLICY IF EXISTS "Only coordenador can update appearance settings" ON public.appearance_settings;

CREATE POLICY "Coordenadores podem gerenciar configurações de aparência"
ON public.appearance_settings 
FOR ALL
USING (public.has_role(auth.uid(), 'coordenador'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'coordenador'::app_role));