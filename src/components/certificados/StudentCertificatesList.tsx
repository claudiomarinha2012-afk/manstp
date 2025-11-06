import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, FileCheck, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

interface Student {
  id: string;
  nome_completo: string;
  matricula: number;
  hasCertificate?: boolean;
}

interface StudentCertificatesListProps {
  turmaId: string | null;
  templateId: string | null;
  stageRef: any;
  orientation: "landscape" | "portrait";
  elements: any[];
  onGenerateCertificate: (studentName: string) => void;
}

export const StudentCertificatesList = ({
  turmaId,
  templateId,
  stageRef,
  orientation,
  elements,
  onGenerateCertificate,
}: StudentCertificatesListProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    if (turmaId) {
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [turmaId, templateId]);

  const fetchStudents = async () => {
    if (!turmaId) return;

    setLoading(true);
    try {
      const { data: alunoTurma, error: alunoError } = await supabase
        .from("aluno_turma")
        .select(`
          alunos (
            id,
            nome_completo,
            matricula
          )
        `)
        .eq("turma_id", turmaId)
        .in("status", ["Cursando", "Concluído"]);

      if (alunoError) throw alunoError;

      const studentIds = alunoTurma?.map((at: any) => at.alunos.id).filter(Boolean) || [];

      let certificateMap: { [key: string]: boolean } = {};
      if (templateId && studentIds.length > 0) {
        const { data: certificates } = await supabase
          .from("student_certificates")
          .select("aluno_id")
          .eq("template_id", templateId)
          .in("aluno_id", studentIds);

        certificateMap = (certificates || []).reduce((acc, cert) => {
          acc[cert.aluno_id] = true;
          return acc;
        }, {} as { [key: string]: boolean });
      }

      const studentsData = alunoTurma?.map((at: any) => ({
        ...at.alunos,
        hasCertificate: certificateMap[at.alunos.id] || false,
      })) || [];

      setStudents(studentsData);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast.error("Erro ao carregar alunos da turma");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificateForStudent = async (student: Student) => {
    if (!stageRef || !templateId) {
      toast.error("Template não salvo. Salve o template antes de gerar certificados.");
      return;
    }

    setGenerating(student.id);

    try {
      // Substituir placeholders nos elementos
      const updatedElements = elements.map((el) => {
        if (el.type === "text") {
          let text = el.text;
          if (text.includes("Nome do Aluno") || text.toLowerCase().includes("aluno")) {
            text = student.nome_completo;
          }
          return { ...el, text };
        }
        return el;
      });

      // Atualizar o stage temporariamente
      onGenerateCertificate(student.nome_completo);

      // Aguardar um frame para o canvas atualizar
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = stageRef.toDataURL({ pixelRatio: 2 });
      
      const pdf = new jsPDF({
        orientation: orientation === "landscape" ? "landscape" : "portrait",
        unit: "px",
        format: orientation === "landscape" ? [900, 600] : [600, 900],
      });

      const img = new Image();
      img.onload = async () => {
        pdf.addImage(dataUrl, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        const pdfBlob = pdf.output("blob");

        // Salvar no banco de dados
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Usuário não autenticado");

        const { error: insertError } = await supabase
          .from("student_certificates")
          .upsert({
            template_id: templateId,
            aluno_id: student.id,
            turma_id: turmaId,
            user_id: user.user.id,
          });

        if (insertError) throw insertError;

        // Download do PDF
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificado-${student.nome_completo.replace(/\s+/g, "_")}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success(`Certificado gerado para ${student.nome_completo}`);
        fetchStudents(); // Atualizar lista
      };
      img.src = dataUrl;
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      toast.error("Erro ao gerar certificado");
    } finally {
      setGenerating(null);
    }
  };

  const generateAllCertificates = async () => {
    for (const student of students) {
      if (!student.hasCertificate) {
        await generateCertificateForStudent(student);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay entre gerações
      }
    }
  };

  if (!turmaId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Selecione uma turma para vincular certificados aos alunos
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alunos da Turma</CardTitle>
          {students.length > 0 && (
            <Button
              onClick={generateAllCertificates}
              disabled={!templateId || generating !== null}
              size="sm"
            >
              Gerar Todos os Certificados
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nenhum aluno encontrado nesta turma
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.matricula}</TableCell>
                  <TableCell className="font-medium">{student.nome_completo}</TableCell>
                  <TableCell>
                    {student.hasCertificate ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <FileCheck className="w-4 h-4" />
                        Gerado
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pendente</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={student.hasCertificate ? "outline" : "default"}
                      onClick={() => generateCertificateForStudent(student)}
                      disabled={!templateId || generating === student.id}
                    >
                      {generating === student.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {student.hasCertificate ? "Regerar" : "Gerar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
