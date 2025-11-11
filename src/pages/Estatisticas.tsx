import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import UltraChart from "@/components/UltraChart";
import { CardConfigDialog } from "@/components/CardConfigDialog";

interface StatData {
  totalAlunos: number;
  totalInstrutores: number;
  totalCursos: number;
  totalTurmas: number;
  alunosUnicos: number;
}

interface CardConfig {
  id: string;
  title: string;
  countFrom: "aluno_turma" | "instrutores" | "cursos" | "turmas" | "alunos_unicos";
}

const DEFAULT_CARDS: CardConfig[] = [
  { id: "1", title: "Total de Inscrições", countFrom: "aluno_turma" },
  { id: "2", title: "Total de Instrutores", countFrom: "instrutores" },
  { id: "3", title: "Total de Cursos", countFrom: "cursos" },
  { id: "4", title: "Total de Turmas", countFrom: "turmas" },
];

const Estatisticas = () => {
  const [stats, setStats] = useState<StatData>({
    totalAlunos: 0,
    totalInstrutores: 0,
    totalCursos: 0,
    totalTurmas: 0,
    alunosUnicos: 0,
  });

  const [cardConfigs, setCardConfigs] = useState<CardConfig[]>(() => {
    const saved = localStorage.getItem("estatisticasCardConfigs");
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  useEffect(() => {
    fetchData();
    // Configurar atualização automática a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Buscar total de inscrições (aluno_turma)
      const { data: alunoTurma, error: errorAT } = await supabase
        .from("aluno_turma")
        .select("aluno_id");

      if (errorAT) throw errorAT;

      // Contar total de inscrições (não alunos únicos)
      const totalAlunos = alunoTurma?.length || 0;

      // Contar alunos únicos
      const uniqueAlunoIds = new Set(alunoTurma?.map(at => at.aluno_id) || []);
      const alunosUnicos = uniqueAlunoIds.size;

      // Buscar outros totais
      const [instrutoresResult, cursosResult, turmasResult] = await Promise.all([
        supabase.from("instrutores").select("id", { count: "exact", head: true }),
        supabase.from("cursos").select("id", { count: "exact", head: true }),
        supabase.from("turmas").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalAlunos: totalAlunos,
        totalInstrutores: instrutoresResult.count || 0,
        totalCursos: cursosResult.count || 0,
        totalTurmas: turmasResult.count || 0,
        alunosUnicos: alunosUnicos,
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleSaveCardConfig = (config: CardConfig) => {
    const updated = cardConfigs.map((c) => (c.id === config.id ? config : c));
    setCardConfigs(updated);
    localStorage.setItem("estatisticasCardConfigs", JSON.stringify(updated));
  };

  const getCardValue = (countFrom: CardConfig["countFrom"]): number => {
    switch (countFrom) {
      case "aluno_turma":
        return stats.totalAlunos;
      case "alunos_unicos":
        return stats.alunosUnicos;
      case "instrutores":
        return stats.totalInstrutores;
      case "cursos":
        return stats.totalCursos;
      case "turmas":
        return stats.totalTurmas;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Estatísticas</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfigs.map((config) => (
          <Card key={config.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <CardConfigDialog config={config} onSave={handleSaveCardConfig} />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{getCardValue(config.countFrom)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico Ultra */}
      <UltraChart />
    </div>
  );
};

export default Estatisticas;
