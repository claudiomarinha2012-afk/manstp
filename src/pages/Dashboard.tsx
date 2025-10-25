import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface CursoData {
  nome: string;
  totalAlunos: number;
  turmasAndamento: number;
  local: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [cursosData, setCursosData] = useState<CursoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Buscar todos os cursos com suas turmas e alunos
        const { data: cursos } = await supabase
          .from("cursos")
          .select(`
            id,
            nome,
            local_realizacao,
            turmas (
              id,
              situacao,
              aluno_turma (
                aluno_id
              )
            )
          `);

        if (cursos) {
          const dadosProcessados: CursoData[] = cursos.map((curso: any) => {
            const totalAlunos = curso.turmas?.reduce(
              (sum: number, turma: any) => sum + (turma.aluno_turma?.length || 0),
              0
            ) || 0;

            const turmasAndamento = curso.turmas?.filter(
              (turma: any) => turma.situacao === "Em Andamento"
            ).length || 0;

            return {
              nome: curso.nome || "Sem nome",
              totalAlunos,
              turmasAndamento,
              local: curso.local_realizacao || "Não especificado",
            };
          });

          setCursosData(dadosProcessados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const chartData = {
    labels: cursosData.map((c) => `${c.nome}\n(${c.local})`),
    datasets: [
      {
        label: "Alunos Ativos",
        data: cursosData.map((c) => c.totalAlunos),
        backgroundColor: "hsl(var(--primary))",
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "hsl(var(--foreground))",
          font: {
            size: 13,
            weight: 500,
          },
          padding: 16,
        },
      },
      title: {
        display: true,
        text: "📊 Cursos em Andamento – Localização e Total de Alunos",
        color: "hsl(var(--foreground))",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            const curso = cursosData[context.dataIndex];
            return [
              `Alunos: ${context.parsed.y}`,
              `Turmas em andamento: ${curso.turmasAndamento}`,
            ];
          },
        },
      },
      datalabels: {
        color: "hsl(var(--primary-foreground))",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value: number) => value > 0 ? value : "",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
      x: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Visão geral dos cursos em andamento
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Panorama de Cursos e Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {cursosData.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Nenhum curso com dados disponíveis no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
