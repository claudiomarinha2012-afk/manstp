import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  thumbnail?: string;
  turmaId?: string | null;
  data: {
    elements: any[];
    orientation: "landscape" | "portrait";
    backgroundImage: string;
  };
}

export const useCertificateTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("certificate_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTemplates: Template[] = (data || []).map((t) => ({
        id: t.id,
        name: t.name,
        thumbnail: t.thumbnail || undefined,
        turmaId: t.turma_id,
        data: {
          elements: t.elements as any[],
          orientation: t.orientation as "landscape" | "portrait",
          backgroundImage: t.background_image || "",
        },
      }));

      setTemplates(formattedTemplates);
    } catch (error) {
      console.error("Erro ao buscar templates:", error);
      toast.error("Erro ao carregar templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const saveTemplate = async (
    name: string,
    thumbnail: string,
    turmaId: string | null,
    orientation: "landscape" | "portrait",
    backgroundImage: string,
    elements: any[]
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("certificate_templates")
        .insert({
          name,
          thumbnail,
          turma_id: turmaId,
          orientation,
          background_image: backgroundImage,
          elements,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Template salvo com sucesso!");
      fetchTemplates();
      return data.id;
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template");
      return null;
    }
  };

  const updateTemplate = async (
    id: string,
    name: string,
    thumbnail: string,
    turmaId: string | null,
    orientation: "landscape" | "portrait",
    backgroundImage: string,
    elements: any[]
  ) => {
    try {
      const { error } = await supabase
        .from("certificate_templates")
        .update({
          name,
          thumbnail,
          turma_id: turmaId,
          orientation,
          background_image: backgroundImage,
          elements,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Template atualizado com sucesso!");
      fetchTemplates();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar template:", error);
      toast.error("Erro ao atualizar template");
      return false;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("certificate_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Template excluído com sucesso!");
      fetchTemplates();
      return true;
    } catch (error) {
      console.error("Erro ao excluir template:", error);
      toast.error("Erro ao excluir template");
      return false;
    }
  };

  return {
    templates,
    loading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: fetchTemplates,
  };
};
