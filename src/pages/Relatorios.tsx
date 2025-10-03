import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Relatorios() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">Gere e exporte relatórios customizados</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Relatórios Customizáveis</CardTitle>
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
