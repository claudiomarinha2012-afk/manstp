import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Turma {
  id: string;
  nome: string;
  ano: number;
  cursos: {
    nome: string;
  };
}

interface TurmaAssociationProps {
  selectedTurmaId: string | null;
  onSelectTurma: (turmaId: string | null) => void;
}

export const TurmaAssociation = ({ selectedTurmaId, onSelectTurma }: TurmaAssociationProps) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      const { data, error } = await supabase
        .from("turmas")
        .select(`
          id,
          nome,
          ano,
          cursos (
            nome
          )
        `)
        .order("ano", { ascending: false });

      if (error) throw error;
      setTurmas(data || []);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      toast.error("Erro ao carregar turmas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Associar Turma (Opcional)</Label>
      <Select 
        value={selectedTurmaId || "none"} 
        onValueChange={(value) => onSelectTurma(value === "none" ? null : value)}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Carregando..." : "Selecione uma turma"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhuma turma</SelectItem>
          {turmas.map((turma) => (
            <SelectItem key={turma.id} value={turma.id}>
              {turma.cursos?.nome} - {turma.nome} ({turma.ano})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
