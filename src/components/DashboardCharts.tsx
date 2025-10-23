import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface TurmaData {
  id: string;
  ano: number;
  nome: string;
}

interface AlunoTurmaData {
  turma_id: string;
  status: string;
  alunos: {
    tipo_militar: string;
  };
}

interface DadosGerais {
  ano: number;
  total: number;
  fuzileiros: number;
  marinheiros: number;
  exercito: number;
  civis: number;
}

interface DadosFomm {
  ano: number;
  totalInscritos: number;
  concluintesCiaga: number;
  concluintesCiaba: number;
  taxaConclusao: number;
}

export default function DashboardCharts() {
  const [dadosGerais, setDadosGerais] = useState<DadosGerais[]>([]);
  const [dadosFomm, setDadosFomm] = useState<DadosFomm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar turmas
      const { data: turmas, error: turmasError } = await supabase
        .from("turmas")
        .select("id, ano, nome")
        .order("ano");

      if (turmasError) throw turmasError;

      // Buscar alunos vinculados às turmas
      const { data: alunosTurma, error: alunosError } = await supabase
        .from("aluno_turma")
        .select(`
          turma_id,
          status,
          alunos (
            tipo_militar
          )
        `);

      if (alunosError) throw alunosError;

      if (!turmas || !alunosTurma) return;

      // Processar dados gerais
      const anos = [...new Set(turmas.map(t => t.ano))].sort();
      const gerais = processarDadosGeral(anos, turmas, alunosTurma);
      const fomm = processarDadosFomm(anos, turmas, alunosTurma);

      setDadosGerais(gerais);
      setDadosFomm(fomm);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const processarDadosGeral = (
    anos: number[],
    turmas: TurmaData[],
    alunosTurma: AlunoTurmaData[]
  ): DadosGerais[] => {
    return anos.map(ano => {
      const turmasAno = turmas.filter(t => t.ano === ano);
      const idsTurmas = turmasAno.map(t => t.id);
      const alunosAno = alunosTurma.filter(a => idsTurmas.includes(a.turma_id));

      const fuzileiros = alunosAno.filter(
        a => a.alunos?.tipo_militar?.toLowerCase() === "fuzileiro"
      ).length;
      const marinheiros = alunosAno.filter(
        a => a.alunos?.tipo_militar?.toLowerCase() === "marinheiro"
      ).length;
      const exercito = alunosAno.filter(
        a => a.alunos?.tipo_militar?.toLowerCase() === "exército"
      ).length;
      const civis = alunosAno.filter(
        a => a.alunos?.tipo_militar?.toLowerCase() === "civil"
      ).length;

      const total = fuzileiros + marinheiros + exercito + civis;

      return { ano, total, fuzileiros, marinheiros, exercito, civis };
    });
  };

  const processarDadosFomm = (
    anos: number[],
    turmas: TurmaData[],
    alunosTurma: AlunoTurmaData[]
  ): DadosFomm[] => {
    return anos.map(ano => {
      const turmasFomm = turmas.filter(
        t =>
          t.ano === ano &&
          (t.nome.includes("C-FOMM-CURSO DE FORMAÇÃO DE OFICIAS DA MARINHA MERCANTE - CIABA") ||
            t.nome.includes("C-FOMM-CURSO DE FORMAÇÃO DE OFICIAS DA MARINHA MERCANTE- CIAGA") ||
            t.nome.includes("C-FOMM"))
      );

      const idsTurmas = turmasFomm.map(t => t.id);
      const alunosAno = alunosTurma.filter(a => idsTurmas.includes(a.turma_id));

      const totalInscritos = alunosAno.length;

      const concluintesCiaba = alunosAno.filter(a => {
        const turma = turmas.find(t => t.id === a.turma_id);
        return (
          a.status?.toLowerCase() === "concluído" &&
          turma?.nome.includes("CIABA")
        );
      }).length;

      const concluintesCiaga = alunosAno.filter(a => {
        const turma = turmas.find(t => t.id === a.turma_id);
        return (
          a.status?.toLowerCase() === "concluído" &&
          turma?.nome.includes("CIAGA")
        );
      }).length;

      const totalConcluintes = concluintesCiaba + concluintesCiaga;
      const taxaConclusao = totalInscritos
        ? parseFloat(((totalConcluintes / totalInscritos) * 100).toFixed(1))
        : 0;

      return {
        ano,
        totalInscritos,
        concluintesCiaga,
        concluintesCiaba,
        taxaConclusao,
      };
    });
  };

  const chartOptionsGeral = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Distribuição Geral de Alunos por Ano e Categoria",
        font: { size: 18, weight: "bold" as const },
        color: "hsl(var(--foreground))",
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
        },
      },
      datalabels: {
        anchor: "end" as const,
        align: "top" as const,
        color: "hsl(var(--foreground))",
        font: { weight: "bold" as const },
        formatter: (val: number) => (val > 0 ? val : ""),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade de Alunos",
          color: "hsl(var(--foreground))",
        },
        ticks: {
          color: "hsl(var(--foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ano",
          color: "hsl(var(--foreground))",
        },
        ticks: {
          color: "hsl(var(--foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  const chartOptionsFomm = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "C-FOMM (CIAGA e CIABA) - Inscritos, Concluintes e Taxa de Conclusão (%)",
        font: { size: 18, weight: "bold" as const },
        color: "hsl(var(--foreground))",
      },
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(var(--foreground))",
        },
      },
      datalabels: {
        anchor: "end" as const,
        align: "top" as const,
        color: "hsl(var(--foreground))",
        font: { weight: "bold" as const },
        formatter: (val: number, ctx: any) => {
          if (ctx.dataset.label?.includes("Taxa")) {
            return val > 0 ? `${val}%` : "";
          }
          return val > 0 ? val : "";
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ctx.dataset.label?.includes("Taxa")
              ? `${ctx.parsed.y}%`
              : `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantidade de Alunos",
          color: "hsl(var(--foreground))",
        },
        ticks: {
          color: "hsl(var(--foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
      porcentagem: {
        position: "right" as const,
        beginAtZero: true,
        title: {
          display: true,
          text: "Taxa de Conclusão (%)",
          color: "hsl(var(--foreground))",
        },
        ticks: {
          color: "hsl(var(--foreground))",
        },
        grid: {
          drawOnChartArea: false,
        },
        suggestedMax: 100,
      },
      x: {
        title: {
          display: true,
          text: "Ano",
          color: "hsl(var(--foreground))",
        },
        ticks: {
          color: "hsl(var(--foreground))",
        },
        grid: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  const dataGeral = {
    labels: dadosGerais.map(d => d.ano),
    datasets: [
      {
        label: "Total Geral",
        data: dadosGerais.map(d => d.total),
        backgroundColor: "#1E88E5",
      },
      {
        label: "Fuzileiros",
        data: dadosGerais.map(d => d.fuzileiros),
        backgroundColor: "#43A047",
      },
      {
        label: "Marinheiros",
        data: dadosGerais.map(d => d.marinheiros),
        backgroundColor: "#FB8C00",
      },
      {
        label: "Exército",
        data: dadosGerais.map(d => d.exercito),
        backgroundColor: "#8E24AA",
      },
      {
        label: "Civis",
        data: dadosGerais.map(d => d.civis),
        backgroundColor: "#E53935",
      },
    ],
  };

  const dataFomm = {
    labels: dadosFomm.map(d => d.ano),
    datasets: [
      {
        label: "Total Inscritos (CIAGA + CIABA)",
        data: dadosFomm.map(d => d.totalInscritos),
        backgroundColor: "#1565C0",
      },
      {
        label: "Concluintes CIAGA",
        data: dadosFomm.map(d => d.concluintesCiaga),
        backgroundColor: "#26A69A",
      },
      {
        label: "Concluintes CIABA",
        data: dadosFomm.map(d => d.concluintesCiaba),
        backgroundColor: "#8E24AA",
      },
      {
        type: "line" as const,
        label: "Taxa de Conclusão (%)",
        data: dadosFomm.map(d => d.taxaConclusao),
        yAxisID: "porcentagem",
        borderColor: "#FFB300",
        backgroundColor: "#FFB300",
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#FFB300",
      },
    ],
  };

  if (loading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px" }}>
            <Bar data={dataGeral} options={chartOptionsGeral} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise C-FOMM</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "500px" }}>
            <Bar data={dataFomm} options={chartOptionsFomm} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
