import { Button } from "@/components/ui/button";
import { Type, ImageIcon, User, BookOpen, UserCircle, ArrowUp, ArrowDown, Trash2, Stamp, Replace } from "lucide-react";
import { useRef } from "react";

interface CertificateElementToolbarProps {
  onAddText: () => void;
  onAddCourseName: () => void;
  onAddStudentName: () => void;
  onAddImage: (file: File) => void;
  onAddInstructor: () => void;
  onAddStamp: () => void;
  selectedId: string | null;
  selectedElement: any;
  onMoveLayer: (direction: "front" | "back") => void;
  onDelete: () => void;
  onReplaceImage: (file: File) => void;
}

export const CertificateElementToolbar = ({
  onAddText,
  onAddCourseName,
  onAddStudentName,
  onAddImage,
  onAddInstructor,
  onAddStamp,
  selectedId,
  selectedElement,
  onMoveLayer,
  onDelete,
  onReplaceImage,
}: CertificateElementToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
    }
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplaceImage(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Adicionar elementos</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onAddText}>
            <Type className="w-4 h-4 mr-2" />
            Texto
          </Button>
          <Button variant="outline" size="sm" onClick={onAddCourseName}>
            <BookOpen className="w-4 h-4 mr-2" />
            Nome do curso
          </Button>
          <Button variant="outline" size="sm" onClick={onAddStudentName}>
            <User className="w-4 h-4 mr-2" />
            Nome do aluno
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Imagem
          </Button>
          <Button variant="outline" size="sm" onClick={onAddInstructor}>
            <UserCircle className="w-4 h-4 mr-2" />
            Instrutor
          </Button>
          <Button variant="outline" size="sm" onClick={onAddStamp}>
            <Stamp className="w-4 h-4 mr-2" />
            Carimbo
          </Button>
        </div>
      </div>

      {selectedId && (
        <div className="space-y-3 pt-3 border-t">
          <h3 className="text-sm font-medium text-muted-foreground">Elemento selecionado</h3>
          <div className="flex flex-wrap gap-2">
            {selectedElement?.type === "image" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => replaceInputRef.current?.click()}
              >
                <Replace className="w-4 h-4 mr-2" />
                Substituir imagem
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onMoveLayer("front")}>
              <ArrowUp className="w-4 h-4 mr-2" />
              Trazer para frente
            </Button>
            <Button variant="outline" size="sm" onClick={() => onMoveLayer("back")}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Enviar para trás
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceChange}
      />
    </div>
  );
};
