import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, Save, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import diplomaTemplate from "@/assets/diploma-template.jpg";
import { CertificateTemplateSelector } from "@/components/certificados/CertificateTemplateSelector";
import { CertificateGeneralSettings } from "@/components/certificados/CertificateGeneralSettings";
import { CertificateElementToolbar } from "@/components/certificados/CertificateElementToolbar";
import { CertificateKonvaCanvas } from "@/components/certificados/CertificateKonvaCanvas";
import { FontSelector } from "@/components/certificados/FontSelector";
import { TurmaAssociation } from "@/components/certificados/TurmaAssociation";
import { StudentCertificatesList } from "@/components/certificados/StudentCertificatesList";
import { useCertificateTemplates } from "@/hooks/useCertificateTemplates";

interface Element {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
  [key: string]: any;
}

interface Template {
  id: string;
  name: string;
  thumbnail?: string;
  turmaId?: string | null;
  data: {
    elements: Element[];
    orientation: "landscape" | "portrait";
    backgroundImage: string;
  };
}

export default function Certificados() {
  const { saveTemplate: saveTemplateToDb, updateTemplate } = useCertificateTemplates();
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [stageRef, setStageRef] = useState<any>(null);
  const [currentFont, setCurrentFont] = useState<string>("Arial");
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null);

  useEffect(() => {
    setBackgroundImage(diplomaTemplate);
  }, []);

  const handleBackgroundChange = (file: File | null) => {
    if (!file) {
      setBackgroundImage("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    const newElement: Element = {
      id: uuidv4(),
      type: "text",
      x: 100,
      y: 100,
      text: "Digite seu texto",
      fontSize: 20,
      fontFamily: currentFont,
      fill: "#000000",
    };
    setElements([...elements, newElement]);
    toast.success("Texto adicionado");
  };

  const addCourseName = () => {
    const newElement: Element = {
      id: uuidv4(),
      type: "text",
      x: 100,
      y: 200,
      text: "Nome do Curso",
      fontSize: 24,
      fontFamily: currentFont,
      fontWeight: "bold",
      fill: "#000000",
      textAlign: "center",
    };
    setElements([...elements, newElement]);
    toast.success("Campo de nome do curso adicionado");
  };

  const addStudentName = () => {
    const newElement: Element = {
      id: uuidv4(),
      type: "text",
      x: 100,
      y: 150,
      text: "Nome do Aluno",
      fontSize: 28,
      fontFamily: currentFont,
      fontWeight: "bold",
      fill: "#000000",
      textAlign: "center",
    };
    setElements([...elements, newElement]);
    toast.success("Campo de nome do aluno adicionado");
  };

  const addInstructor = () => {
    const newElement: Element = {
      id: uuidv4(),
      type: "text",
      x: 100,
      y: 250,
      text: "Instrutor",
      fontSize: 18,
      fontFamily: currentFont,
      fill: "#000000",
    };
    setElements([...elements, newElement]);
    toast.success("Campo de instrutor adicionado");
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newElement: Element = {
        id: uuidv4(),
        type: "image",
        src: reader.result as string,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        opacity: 1,
      };
      setElements([...elements, newElement]);
      toast.success("Imagem adicionada");
    };
    reader.readAsDataURL(file);
  };

  const updateElement = (updated: Element) => {
    setElements(elements.map((el) => (el.id === updated.id ? updated : el)));
  };

  const moveLayer = (direction: "front" | "back") => {
    if (!selectedId) return;

    const index = elements.findIndex((el) => el.id === selectedId);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === "front" && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [
        newElements[index + 1],
        newElements[index],
      ];
    } else if (direction === "back" && index > 0) {
      [newElements[index], newElements[index - 1]] = [
        newElements[index - 1],
        newElements[index],
      ];
    }
    setElements(newElements);
    toast.success("Camada alterada");
  };

  const deleteElement = () => {
    if (!selectedId) return;
    setElements(elements.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    toast.success("Elemento excluído");
  };

  const saveTemplate = async () => {
    if (!stageRef) return;
    if (!templateName.trim()) {
      toast.error("Digite um nome para o template");
      return;
    }

    const thumbnail = stageRef.toDataURL({ pixelRatio: 0.5 });

    if (selectedTemplate?.id && selectedTemplate.id !== "new") {
      // Atualizar template existente
      await updateTemplate(
        selectedTemplate.id,
        templateName,
        thumbnail,
        selectedTurmaId,
        orientation,
        backgroundImage,
        elements
      );
    } else {
      // Criar novo template
      const newId = await saveTemplateToDb(
        templateName,
        thumbnail,
        selectedTurmaId,
        orientation,
        backgroundImage,
        elements
      );

      if (newId) {
        setSelectedTemplate({
          id: newId,
          name: templateName,
          thumbnail,
          turmaId: selectedTurmaId,
          data: { elements, orientation, backgroundImage },
        });
      }
    }

    setTemplateName("");
  };

  const handleSelectTemplate = (template: Template | null) => {
    if (!template) {
      setSelectedTemplate(null);
      setElements([]);
      setSelectedId(null);
      setSelectedTurmaId(null);
      setTemplateName("");
      return;
    }

    setSelectedTemplate(template);
    setOrientation(template.data.orientation);
    setBackgroundImage(template.data.backgroundImage);
    setElements(template.data.elements);
    setSelectedTurmaId(template.turmaId || null);
    setTemplateName(template.name);
    toast.success("Template carregado");
  };

  const handlePreview = () => {
    if (!stageRef) return;

    const dataUrl = stageRef.toDataURL({ pixelRatio: 2 });
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${dataUrl}" style="width:100%;"/>`);
    }
  };

  const exportToPDF = () => {
    if (!stageRef) return;

    const dataUrl = stageRef.toDataURL({ pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: orientation === "landscape" ? "landscape" : "portrait",
      unit: "px",
      format: orientation === "landscape" ? [900, 600] : [600, 900],
    });

    const img = new Image();
    img.onload = () => {
      pdf.addImage(dataUrl, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`certificado-${Date.now()}.pdf`);
      toast.success("PDF exportado com sucesso!");
    };
    img.src = dataUrl;
  };

  const handleGenerateCertificate = (studentName: string) => {
    // Atualizar elementos com o nome do aluno
    const updatedElements = elements.map((el) => {
      if (el.type === "text") {
        let text = el.text;
        if (text.includes("Nome do Aluno") || text.toLowerCase().includes("aluno")) {
          text = studentName;
        }
        return { ...el, text };
      }
      return el;
    });
    setElements(updatedElements);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editor de Certificados</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button onClick={saveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Template
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        <Card className="p-6">
          <CertificateTemplateSelector
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate?.id || "new"}
          />
        </Card>

        <Card className="p-6 space-y-6">
          <CertificateGeneralSettings
            orientation={orientation}
            onOrientationChange={setOrientation}
            backgroundImage={backgroundImage}
            onBackgroundChange={handleBackgroundChange}
          />

          <div className="border-t pt-4">
            <FontSelector value={currentFont} onChange={setCurrentFont} />
          </div>

          <CertificateElementToolbar
            onAddText={addText}
            onAddCourseName={addCourseName}
            onAddStudentName={addStudentName}
            onAddImage={addImage}
            onAddInstructor={addInstructor}
            selectedId={selectedId}
            onMoveLayer={moveLayer}
            onDelete={deleteElement}
          />

          <div className="border-t pt-4">
            <TurmaAssociation 
              selectedTurmaId={selectedTurmaId}
              onSelectTurma={setSelectedTurmaId}
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Nome do Template (para salvar)</Label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Digite o nome do template..."
            />
          </div>
        </Card>

        <CertificateKonvaCanvas
          orientation={orientation}
          backgroundImage={backgroundImage}
          elements={elements}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
          onUpdateElement={updateElement}
          onStageReady={setStageRef}
        />

        {selectedTurmaId && selectedTemplate?.id && selectedTemplate.id !== "new" && (
          <StudentCertificatesList
            turmaId={selectedTurmaId}
            templateId={selectedTemplate.id}
            stageRef={stageRef}
            orientation={orientation}
            elements={elements}
            onGenerateCertificate={handleGenerateCertificate}
          />
        )}
      </div>
    </div>
  );
}
