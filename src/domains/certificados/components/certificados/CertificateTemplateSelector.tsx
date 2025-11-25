import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus, Loader2, Trash2 } from "lucide-react";
import { useCertificateTemplates } from "@/hooks/useCertificateTemplates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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

interface CertificateTemplateSelectorProps {
  onSelectTemplate: (template: Template | null) => void;
  selectedTemplateId: string;
}

export const CertificateTemplateSelector = ({
  onSelectTemplate,
  selectedTemplateId,
}: CertificateTemplateSelectorProps) => {
  const { templates, loading, deleteTemplate } = useCertificateTemplates();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    setTemplateToDelete(templateId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete);
      if (selectedTemplateId === templateToDelete) {
        onSelectTemplate(null);
      }
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Templates Salvos</Label>
          <Button variant="outline" size="sm" onClick={() => onSelectTemplate(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum template salvo. Crie seu primeiro template!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer p-3 hover:border-primary transition-colors ${
                  selectedTemplateId === template.id ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectTemplate(template)}
              >
                {template.thumbnail ? (
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <p className="text-sm font-medium truncate">{template.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-destructive hover:text-destructive"
                  onClick={(e) => handleDeleteClick(e, template.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita e todos
              os certificados gerados com este template permanecerão salvos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
