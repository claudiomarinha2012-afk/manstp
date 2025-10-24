import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BookOpen, MapPin, Loader2 } from "lucide-react";

interface BulkCourseInfoUpdateProps {
  turmaId: string;
  turmaNome: string;
  totalAlunos: number;
  onSuccess: () => void;
}

export function BulkCourseInfoUpdate({ 
  turmaId, 
  turmaNome, 
  totalAlunos,
  onSuccess 
}: BulkCourseInfoUpdateProps) {
  const [siglaCurso, setSiglaCurso] = useState("");
  const [localCurso, setLocalCurso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBulkUpdate = async () => {
    if (!siglaCurso && !localCurso) {
      toast.error("Preencha pelo menos um campo (Sigla ou Local)");
      return;
    }

    setLoading(true);
    try {
      // Buscar todos os vínculos aluno-turma para esta turma
      const { data: vinculos, error: vinculosError } = await supabase
        .from("aluno_turma")
        .select("id")
        .eq("turma_id", turmaId);

      if (vinculosError) throw vinculosError;

      if (!vinculos || vinculos.length === 0) {
        toast.warning("Nenhum aluno vinculado a esta turma");
        setLoading(false);
        return;
      }

      // Preparar objeto de atualização
      const updateData: Record<string, string> = {};
      if (siglaCurso) updateData.sigla_curso = siglaCurso;
      if (localCurso) updateData.local_curso = localCurso;

      // Atualizar todos os vínculos
      const { error: updateError } = await supabase
        .from("aluno_turma")
        .update(updateData)
        .eq("turma_id", turmaId);

      if (updateError) throw updateError;

      toast.success(
        `Atualização em massa aplicada com sucesso para ${vinculos.length} aluno(s)!`,
        {
          description: `${siglaCurso ? `Sigla: ${siglaCurso}` : ""} ${
            localCurso ? `Local: ${localCurso}` : ""
          }`,
        }
      );

      setSiglaCurso("");
      setLocalCurso("");
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao aplicar atualização em massa", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Atualização em Massa - Sigla e Local do Curso
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Turma: <span className="font-semibold">{turmaNome}</span> •{" "}
          <span className="font-semibold">{totalAlunos}</span> aluno(s)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siglaCurso" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Sigla do Curso
            </Label>
            <Input
              id="siglaCurso"
              placeholder="Ex: C-FOMM-CIAGA"
              value={siglaCurso}
              onChange={(e) => setSiglaCurso(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localCurso" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local do Curso
            </Label>
            <Input
              id="localCurso"
              placeholder="Ex: CIAGA, CIABA, CENPEM"
              value={localCurso}
              onChange={(e) => setLocalCurso(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          onClick={handleBulkUpdate} 
          disabled={loading || (!siglaCurso && !localCurso)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aplicando atualização...
            </>
          ) : (
            `Aplicar para todos os ${totalAlunos} aluno(s) da turma`
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Esta ação irá atualizar os campos selecionados para todos os alunos
          vinculados a esta turma.
        </p>
      </CardContent>
    </Card>
  );
}
