import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Image as ImageIcon,
  Layers,
  Trash2,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Eye,
  Download,
  Square,
  Circle,
  Triangle,
  Minus,
  Plus,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PowerPointToolbarProps {
  selectedElement: any;
  onUpdateElement: (element: any) => void;
  onAddText: () => void;
  onAddImage: (file: File) => void;
  onAddShape: (shape: "rectangle" | "circle" | "line") => void;
  onDelete: () => void;
  onMoveLayer: (direction: "front" | "back") => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  currentFont: string;
  onFontChange: (font: string) => void;
  templateName: string;
  onTemplateNameChange: (name: string) => void;
}

export const PowerPointToolbar = ({
  selectedElement,
  onUpdateElement,
  onAddText,
  onAddImage,
  onAddShape,
  onDelete,
  onMoveLayer,
  onSave,
  onPreview,
  onExport,
  currentFont,
  onFontChange,
  templateName,
  onTemplateNameChange,
}: PowerPointToolbarProps) => {
  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
    "Trebuchet MS",
    "Palatino",
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  const handleTextAlign = (align: "left" | "center" | "right" | "justify") => {
    if (selectedElement && selectedElement.type === "text") {
      onUpdateElement({ ...selectedElement, textAlign: align });
    }
  };

  const toggleBold = () => {
    if (selectedElement && selectedElement.type === "text") {
      const currentWeight = selectedElement.fontWeight || "normal";
      onUpdateElement({
        ...selectedElement,
        fontWeight: currentWeight === "bold" ? "normal" : "bold",
      });
    }
  };

  const toggleItalic = () => {
    if (selectedElement && selectedElement.type === "text") {
      const currentStyle = selectedElement.fontStyle || "normal";
      onUpdateElement({
        ...selectedElement,
        fontStyle: currentStyle === "italic" ? "normal" : "italic",
      });
    }
  };

  const toggleUnderline = () => {
    if (selectedElement && selectedElement.type === "text") {
      const currentUnderline = selectedElement.textDecoration || "none";
      onUpdateElement({
        ...selectedElement,
        textDecoration: currentUnderline === "underline" ? "none" : "underline",
      });
    }
  };

  const handleFontSizeChange = (size: string) => {
    if (selectedElement && selectedElement.type === "text") {
      onUpdateElement({ ...selectedElement, fontSize: parseInt(size) });
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedElement && selectedElement.type === "text") {
      onUpdateElement({ ...selectedElement, fill: color });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
    }
  };

  const isTextSelected = selectedElement?.type === "text";

  return (
    <div className="bg-background border-b">
      {/* Primeira linha - Arquivo e ações principais */}
      <div className="flex items-center gap-2 px-4 py-2 border-b">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Nome do template"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Segunda linha - Ferramentas de formatação */}
      <div className="flex items-center gap-2 px-4 py-2">
        {/* Fonte */}
        <div className="flex items-center gap-2">
          <Select value={currentFont} onValueChange={onFontChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tamanho da fonte */}
          <Select
            value={selectedElement?.fontSize?.toString() || "20"}
            onValueChange={handleFontSizeChange}
            disabled={!isTextSelected}
          >
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Formatação de texto */}
        <div className="flex items-center gap-1">
          <Button
            variant={selectedElement?.fontWeight === "bold" ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleBold}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedElement?.fontStyle === "italic" ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleItalic}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={
              selectedElement?.textDecoration === "underline" ? "secondary" : "ghost"
            }
            size="sm"
            onClick={toggleUnderline}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alinhamento */}
        <div className="flex items-center gap-1">
          <Button
            variant={selectedElement?.textAlign === "left" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTextAlign("left")}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedElement?.textAlign === "center" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTextAlign("center")}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={selectedElement?.textAlign === "right" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleTextAlign("right")}
            disabled={!isTextSelected}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Cor do texto */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={!isTextSelected}
              className="h-8 w-8 p-0"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <div className="space-y-2">
              <Label>Cor do texto</Label>
              <Input
                type="color"
                value={selectedElement?.fill || "#000000"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-full"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Inserir elementos */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onAddText} className="h-8">
            <Type className="w-4 h-4 mr-2" />
            Texto
          </Button>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImageIcon className="w-4 h-4 mr-2" />
              Imagem
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddShape("rectangle")}
            className="h-8"
          >
            <Square className="w-4 h-4 mr-2" />
            Forma
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Camadas */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveLayer("front")}
            disabled={!selectedElement}
            className="h-8"
          >
            <Layers className="w-4 h-4 mr-2" />
            Trazer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMoveLayer("back")}
            disabled={!selectedElement}
            className="h-8"
          >
            <Layers className="w-4 h-4 mr-2" />
            Enviar
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Excluir */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={!selectedElement}
          className="h-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
