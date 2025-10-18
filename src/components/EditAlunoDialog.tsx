import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Aluno {
  id: string;
  nome_completo: string;
  graduacao: string;
  tipo_militar: string;
  local_servico?: string;
  email: string | null;
  telefone: string | null;
}

interface EditAlunoDialogProps {
  aluno: Aluno;
  onSuccess: () => void;
}

const rankMap: Record<string, string> = {
  "Almirante de Esquadra": "Almirante de Esquadra",
  "Vice-Almirante": "Vice-Almirante",
  "Contra-Almirante": "Contra-Almirante",
  "Capitão de Mar e Guerra": "Capitão de Mar e Guerra",
  "Capitão de Fragata": "Capitão de Fragata",
  "Capitão de Corveta": "Capitão de Corveta",
  "Capitão-Tenente": "Capitão-Tenente",
  "Primeiro-Tenente": "Primeiro-Tenente",
  "Segundo-Tenente": "Segundo-Tenente",
  "Guarda-Marinha": "Guarda-Marinha",
  "Suboficial": "Suboficial",
  "Primeiro-Sargento": "Primeiro-Sargento",
  "Segundo-Sargento": "Segundo-Sargento",
  "Terceiro-Sargento": "Terceiro-Sargento",
  "Cabo": "Cabo",
  "Primeiro Cabo": "Primeiro Cabo",
  "Marinheiro": "Marinheiro"
};

const rankKeys = Object.keys(rankMap);

export function EditAlunoDialog({ aluno, onSuccess }: EditAlunoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: aluno.nome_completo,
    graduacao: aluno.graduacao,
    tipo_militar: aluno.tipo_militar,
    local_servico: aluno.local_servico || "",
    email: aluno.email || "",
    telefone: aluno.telefone || ""
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("alunos")
        .update({
          nome_completo: formData.nome_completo,
          graduacao: formData.graduacao as any,
          tipo_militar: formData.tipo_militar as any,
          local_servico: formData.local_servico,
          email: formData.email || null,
          telefone: formData.telefone || null
        })
        .eq("id", aluno.id);

      if (error) throw error;

      toast.success("Aluno atualizado com sucesso");
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast.error("Erro ao atualizar aluno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nome Completo *</Label>
            <Input
              value={formData.nome_completo}
              onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posto / Graduação *</Label>
              <Select
                value={formData.graduacao}
                onValueChange={(value) => setFormData({ ...formData, graduacao: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {rankKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {rankMap[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo Militar *</Label>
              <Select
                value={formData.tipo_militar}
                onValueChange={(value) => setFormData({ ...formData, tipo_militar: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuzileiro Naval">Fuzileiro Naval</SelectItem>
                  <SelectItem value="Guarda Costeiro">Guarda Costeiro</SelectItem>
                  <SelectItem value="Marinha do Brasil">Marinha do Brasil</SelectItem>
                  <SelectItem value="Exercito">Exército</SelectItem>
                  <SelectItem value="Bombeiro">Bombeiro</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>OM ONDE SERVE</Label>
            <Select
              value={formData.local_servico}
              onValueChange={(value) => setFormData({ ...formData, local_servico: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a OM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Guarda Costeira">Guarda Costeira</SelectItem>
                <SelectItem value="Quartel de Fuzileiros">Quartel de Fuzileiros</SelectItem>
                <SelectItem value="Exército">Exército</SelectItem>
                <SelectItem value="Palácio do Governo">Palácio do Governo</SelectItem>
                <SelectItem value="Bombeiros">Bombeiros</SelectItem>
                <SelectItem value="Polícia">Polícia</SelectItem>
                <SelectItem value="Ministério da Defesa">Ministério da Defesa</SelectItem>
                <SelectItem value="Missão UPDE">Missão UPDE</SelectItem>
                <SelectItem value="Nome RAP">Nome RAP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
