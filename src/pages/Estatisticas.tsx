import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Estatisticas() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estatísticas</h2>
        <p className="text-muted-foreground">Visualize estatísticas e métricas do sistema</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Gráficos e Análises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
