import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { FileDown, Calendar } from "lucide-react";

interface Turma {
  id: string;
  nome: string;
}

export default function Horarios() {
  const { t } = useTranslation();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [conteudo, setConteudo] = useState("");

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    const { data, error } = await supabase.from("turmas").select("id, nome");
    if (error) {
      toast.error("Erro ao carregar turmas");
      return;
    }
    setTurmas(data || []);
  };

  const gerarPDF = () => {
    const turma = turmas.find((t) => t.id === selectedTurma);
    if (!turma) {
      toast.error("Selecione uma turma");
      return;
    }

    if (!conteudo.trim()) {
      toast.error("Digite o conteúdo da programação");
      return;
    }

    const doc = new jsPDF("portrait", "pt", "a4");
    
    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Programação Semanal", 40, 50);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Turma: ${turma.nome}`, 40, 75);
    
    // Divider
    doc.setLineWidth(1);
    doc.line(40, 85, 555, 85);
    
    // Content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(conteudo, 515);
    doc.text(lines, 40, 105);
    
    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
      40,
      pageHeight - 30
    );
    
    doc.save(`${turma.nome}_horario_semanal.pdf`);
    toast.success("PDF gerado com sucesso!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">{t("weeklySchedule") || "Programação Semanal"}</h1>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>Selecionar Turma</Label>
          <Select value={selectedTurma} onValueChange={setSelectedTurma}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma turma" />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((turma) => (
                <SelectItem key={turma.id} value={turma.id}>
                  {turma.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Conteúdo da Programação Semanal</Label>
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Digite aqui a programação semanal da turma...

Exemplo:
Segunda-feira:
- 08:00 - 10:00: Matemática
- 10:30 - 12:00: Português

Terça-feira:
- 08:00 - 10:00: História
- 10:30 - 12:00: Geografia"
            rows={15}
            className="font-mono"
          />
        </div>

        <Button onClick={gerarPDF} className="w-full" size="lg">
          <FileDown className="w-4 h-4 mr-2" />
          Gerar PDF da Programação
        </Button>
      </Card>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> O PDF será gerado em formato A4 vertical, pronto para impressão. 
          Digite a programação completa da semana no campo acima.
        </p>
      </Card>
    </div>
  );
}
