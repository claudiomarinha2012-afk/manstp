import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Turma {
  id: string;
  nome: string;
}

interface Aluno {
  id: string;
  nome_completo: string;
}

interface Disciplina {
  id: string;
  nome: string;
}

interface Nota {
  aluno_id: string;
  disciplina_id: string;
  nota: number;
}

export default function Notas() {
  const { t } = useTranslation();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [novaDisciplina, setNovaDisciplina] = useState("");

  useEffect(() => {
    fetchTurmas();
  }, []);

  useEffect(() => {
    if (selectedTurma) {
      fetchAlunosDaTurma();
      fetchDisciplinas();
    }
  }, [selectedTurma]);

  const fetchTurmas = async () => {
    const { data, error } = await supabase.from("turmas").select("id, nome");
    if (error) {
      toast.error("Erro ao carregar turmas");
      return;
    }
    setTurmas(data || []);
  };

  const fetchAlunosDaTurma = async () => {
    const { data, error } = await supabase
      .from("aluno_turma")
      .select("aluno_id, alunos(id, nome_completo)")
      .eq("turma_id", selectedTurma);

    if (error) {
      toast.error("Erro ao carregar alunos");
      return;
    }

    const alunosData = data?.map((item: any) => ({
      id: item.alunos.id,
      nome_completo: item.alunos.nome_completo,
    })) || [];

    setAlunos(alunosData);
  };

  const fetchDisciplinas = async () => {
    // Simulated - In production, you'd have a disciplinas table
    setDisciplinas([
      { id: "1", nome: "Matemática" },
      { id: "2", nome: "Português" },
      { id: "3", nome: "História" },
    ]);
  };

  const adicionarDisciplina = () => {
    if (!novaDisciplina.trim()) {
      toast.error("Digite o nome da disciplina");
      return;
    }

    const novaDisciplinaObj = {
      id: `disc-${Date.now()}`,
      nome: novaDisciplina,
    };

    setDisciplinas([...disciplinas, novaDisciplinaObj]);
    setNovaDisciplina("");
    toast.success("Disciplina adicionada!");
  };

  const atualizarNota = (alunoId: string, disciplinaId: string, valor: string) => {
    const nota = parseFloat(valor);
    if (isNaN(nota)) return;

    const notasAtualizadas = notas.filter(
      n => !(n.aluno_id === alunoId && n.disciplina_id === disciplinaId)
    );
    
    notasAtualizadas.push({ aluno_id: alunoId, disciplina_id: disciplinaId, nota });
    setNotas(notasAtualizadas);
  };

  const getNota = (alunoId: string, disciplinaId: string): number => {
    const nota = notas.find(n => n.aluno_id === alunoId && n.disciplina_id === disciplinaId);
    return nota?.nota || 0;
  };

  const calcularMedia = (alunoId: string): string => {
    const notasAluno = notas.filter(n => n.aluno_id === alunoId);
    if (notasAluno.length === 0) return "0.00";
    
    const soma = notasAluno.reduce((acc, n) => acc + n.nota, 0);
    return (soma / notasAluno.length).toFixed(2);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("grades") || "Mapa de Notas"}</h1>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label>Adicionar Disciplina</Label>
            <div className="flex gap-2">
              <Input
                value={novaDisciplina}
                onChange={(e) => setNovaDisciplina(e.target.value)}
                placeholder="Nome da disciplina"
              />
              <Button onClick={adicionarDisciplina} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {selectedTurma && alunos.length > 0 && (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Aluno</TableHead>
                  {disciplinas.map((disc) => (
                    <TableHead key={disc.id} className="text-center min-w-[100px]">
                      {disc.nome}
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold">Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome_completo}</TableCell>
                    {disciplinas.map((disc) => (
                      <TableCell key={disc.id} className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={getNota(aluno.id, disc.id) || ""}
                          onChange={(e) => atualizarNota(aluno.id, disc.id, e.target.value)}
                          className="w-20 text-center"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold">
                      {calcularMedia(aluno.id)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {selectedTurma && alunos.length === 0 && (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Nenhum aluno cadastrado nesta turma
          </p>
        </Card>
      )}
    </div>
  );
}
