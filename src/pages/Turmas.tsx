import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Turmas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Turmas</h2>
          <p className="text-muted-foreground">Gerencie as turmas cadastradas</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar turmas..."
              className="pl-9"
            />
          </div>
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
