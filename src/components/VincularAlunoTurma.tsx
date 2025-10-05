import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface VincularAlunoTurmaProps {
  turmaId: string;
  turmaNome: string;
  onSuccess: () => void;
}

interface Aluno {
  id: string;
  nome_completo: string;
  graduacao: string;
  tipo_militar: string;
}

export function VincularAlunoTurma({ turmaId, turmaNome, onSuccess }: VincularAlunoTurmaProps) {
  const [open, setOpen] = useState(false);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunosVinculados, setAlunosVinculados] = useState<string[]>([]);
  const [selectedAluno, setSelectedAluno] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAlunos();
      fetchAlunosVinculados();
    }
  }, [open, turmaId]);

  const fetchAlunos = async () => {
    try {
      const { data, error } = await supabase
        .from("alunos")
        .select("id, nome_completo, graduacao, tipo_militar")
        .order("nome_completo");

      if (error) throw error;
      setAlunos(data || []);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast.error("Erro ao carregar alunos");
    }
  };

  const fetchAlunosVinculados = async () => {
    try {
      const { data, error } = await supabase
        .from("aluno_turma")
        .select("aluno_id")
        .eq("turma_id", turmaId);

      if (error) throw error;
      setAlunosVinculados(data?.map((item) => item.aluno_id) || []);
    } catch (error) {
      console.error("Erro ao buscar vínculos:", error);
    }
  };

  const handleVincular = async () => {
    if (!selectedAluno) {
      toast.error("Selecione um aluno");
      return;
    }

    if (alunosVinculados.includes(selectedAluno)) {
      toast.error("Aluno já vinculado a esta turma");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("aluno_turma")
        .insert({ aluno_id: selectedAluno, turma_id: turmaId });

      if (error) throw error;

      toast.success("Aluno vinculado com sucesso!");
      setSelectedAluno("");
      fetchAlunosVinculados();
      onSuccess();
    } catch (error) {
      console.error("Erro ao vincular aluno:", error);
      toast.error("Erro ao vincular aluno");
    } finally {
      setLoading(false);
    }
  };

  const alunosDisponiveis = alunos.filter(
    (aluno) => !alunosVinculados.includes(aluno.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Vincular Aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular Aluno à Turma: {turmaNome}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Selecione o Aluno</Label>
            <Select value={selectedAluno} onValueChange={setSelectedAluno}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunosDisponiveis.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum aluno disponível
                  </SelectItem>
                ) : (
                  alunosDisponiveis.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome_completo} - {aluno.graduacao} ({aluno.tipo_militar})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleVincular} disabled={loading || !selectedAluno}>
              {loading ? "Vinculando..." : "Vincular"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
