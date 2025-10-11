import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

interface CursoStats {
  cursoNome: string;
  cursoId: string;
  anoStats: {
    ano: number;
    categorias: {
      "Fuzileiro Naval": number;
      "Guarda Costeiro": number;
      "Exército": number;
      "Civil": number;
    };
    totalAno: number;
  }[];
  totalCurso: number;
}

export default function Estatisticas() {
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<CursoStats[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Buscar todos os alunos vinculados a turmas com informações de curso
      const { data, error } = await supabase
        .from("aluno_turma")
        .select(`
          aluno_id,
          alunos!inner(tipo_militar),
          turmas!inner(
            ano,
            curso_id,
            cursos!inner(nome)
          )
        `);

      if (error) throw error;

      // Estrutura para agrupar os dados
      const cursosMap = new Map<string, CursoStats>();

      data?.forEach((item: any) => {
        const cursoId = item.turmas.curso_id;
        const cursoNome = item.turmas.cursos.nome;
        const ano = item.turmas.ano;
        const tipoMilitar = item.alunos.tipo_militar;

        // Inicializar curso se não existir
        if (!cursosMap.has(cursoId)) {
          cursosMap.set(cursoId, {
            cursoId,
            cursoNome,
            anoStats: [],
            totalCurso: 0,
          });
        }

        const curso = cursosMap.get(cursoId)!;

        // Buscar ou criar ano
        let anoStat = curso.anoStats.find((a) => a.ano === ano);
        if (!anoStat) {
          anoStat = {
            ano,
            categorias: {
              "Fuzileiro Naval": 0,
              "Guarda Costeiro": 0,
              "Exército": 0,
              "Civil": 0,
            },
            totalAno: 0,
          };
          curso.anoStats.push(anoStat);
        }

        // Incrementar contador da categoria
        if (tipoMilitar in anoStat.categorias) {
          anoStat.categorias[tipoMilitar as keyof typeof anoStat.categorias]++;
          anoStat.totalAno++;
          curso.totalCurso++;
        }
      });

      // Ordenar anos dentro de cada curso
      cursosMap.forEach((curso) => {
        curso.anoStats.sort((a, b) => b.ano - a.ano);
      });

      // Converter Map para Array e ordenar por nome do curso
      const estatisticasArray = Array.from(cursosMap.values()).sort((a, b) =>
        a.cursoNome.localeCompare(b.cursoNome)
      );

      setEstatisticas(estatisticasArray);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (estatisticas.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
          <p className="text-muted-foreground">Visualize estatísticas e métricas do sistema</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum dado disponível. Cadastre alunos e vincule-os a turmas para visualizar estatísticas.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
        <p className="text-muted-foreground">
          Alunos agrupados por Curso → Ano → Categoria
        </p>
      </div>

      <Tabs defaultValue={estatisticas[0]?.cursoId} className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-2 justify-start">
          {estatisticas.map((curso) => (
            <TabsTrigger key={curso.cursoId} value={curso.cursoId}>
              {curso.cursoNome}
            </TabsTrigger>
          ))}
        </TabsList>

        {estatisticas.map((curso) => (
          <TabsContent key={curso.cursoId} value={curso.cursoId} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{curso.cursoNome}</span>
                  <span className="text-primary">Total: {curso.totalCurso} alunos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {curso.anoStats.map((anoStat) => (
                    <div key={anoStat.ano} className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center justify-between border-b pb-2">
                        <span>Ano: {anoStat.ano}</span>
                        <span className="text-sm text-muted-foreground">
                          Total do ano: {anoStat.totalAno} alunos
                        </span>
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="text-right">Quantidade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Fuzileiro Naval</TableCell>
                            <TableCell className="text-right">
                              {anoStat.categorias["Fuzileiro Naval"]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Guarda Costeiro</TableCell>
                            <TableCell className="text-right">
                              {anoStat.categorias["Guarda Costeiro"]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Exército</TableCell>
                            <TableCell className="text-right">
                              {anoStat.categorias["Exército"]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Civil</TableCell>
                            <TableCell className="text-right">
                              {anoStat.categorias["Civil"]}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-muted/50 font-semibold">
                            <TableCell>Total do Ano</TableCell>
                            <TableCell className="text-right">{anoStat.totalAno}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
