import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { alunoSchema } from "@/lib/validations";

interface Aluno {
  id: string;
  nome_completo: string;
  graduacao: string;
  tipo_militar: string;
  telefone: string | null;
  email: string | null;
  observacoes: string | null;
}

interface AlunoFormProps {
  aluno?: Aluno;
  onSuccess: () => void;
}

export function AlunoForm({ aluno, onSuccess }: AlunoFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    nome_completo: string;
    graduacao: string;
    tipo_militar: string;
    local_servico: string;
    telefone: string;
    email: string;
    observacoes: string;
    status: string;
  }>({
    nome_completo: aluno?.nome_completo || "",
    graduacao: aluno?.graduacao || "",
    tipo_militar: aluno?.tipo_militar || "",
    local_servico: (aluno as any)?.local_servico || "",
    telefone: aluno?.telefone || "",
    email: aluno?.email || "",
    observacoes: aluno?.observacoes || "",
    status: (aluno as any)?.status || "Cursando",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form data
    const validation = alunoSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    try {
      if (aluno) {
        const { error } = await supabase
          .from("alunos")
          .update(formData as any)
          .eq("id", aluno.id);

        if (error) throw error;
        toast.success("Aluno atualizado com sucesso");
      } else {
        const { error } = await supabase
          .from("alunos")
          .insert([{ ...formData, user_id: user.id } as any]);

        if (error) throw error;
        toast.success("Aluno cadastrado com sucesso");
      }

      setOpen(false);
      onSuccess();
      if (!aluno) {
        setFormData({
          nome_completo: "",
          graduacao: "",
          tipo_militar: "",
          local_servico: "",
          telefone: "",
          email: "",
          observacoes: "",
          status: "Cursando",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      toast.error("Erro ao salvar aluno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {aluno ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{aluno ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                required
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduacao">Graduação *</Label>
              <Select
                required
                value={formData.graduacao}
                onValueChange={(value) => setFormData({ ...formData, graduacao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a graduação" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="Brigadeiro">Brigadeiro</SelectItem>
                  <SelectItem value="Coronel">Coronel</SelectItem>
                  <SelectItem value="Capitão de Mar e Guerra">Capitão de Mar e Guerra</SelectItem>
                  <SelectItem value="Tenente Coronel">Tenente Coronel</SelectItem>
                  <SelectItem value="Capitão de Fragata">Capitão de Fragata</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Capitão Tenente">Capitão Tenente</SelectItem>
                  <SelectItem value="Capitão">Capitão</SelectItem>
                  <SelectItem value="Primeiro Tenente">Primeiro Tenente</SelectItem>
                  <SelectItem value="Tenente">Tenente</SelectItem>
                  <SelectItem value="Segundo Tenente">Segundo Tenente</SelectItem>
                  <SelectItem value="Alferes">Alferes</SelectItem>
                  <SelectItem value="Guarda Marinha">Guarda Marinha</SelectItem>
                  <SelectItem value="Aspirante">Aspirante</SelectItem>
                  <SelectItem value="Sargento Mor">Sargento Mor</SelectItem>
                  <SelectItem value="Sargento Chefe">Sargento Chefe</SelectItem>
                  <SelectItem value="Sargento Ajudante">Sargento Ajudante</SelectItem>
                  <SelectItem value="Primeiro Sargento">Primeiro Sargento</SelectItem>
                  <SelectItem value="Segundo Sargento">Segundo Sargento</SelectItem>
                  <SelectItem value="Furriel">Furriel</SelectItem>
                  <SelectItem value="Primeiro Subsargento">Primeiro Subsargento</SelectItem>
                  <SelectItem value="Segundo Furriel">Segundo Furriel</SelectItem>
                  <SelectItem value="Subsargento">Subsargento</SelectItem>
                  <SelectItem value="Cabo de Seção">Cabo de Seção</SelectItem>
                  <SelectItem value="Cabo">Cabo</SelectItem>
                  <SelectItem value="Segundo Cabo">Segundo Cabo</SelectItem>
                  <SelectItem value="Segundo Marinheiro">Segundo Marinheiro</SelectItem>
                  <SelectItem value="Soldado">Soldado</SelectItem>
                  <SelectItem value="Grumete">Grumete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_militar">Tipo Militar *</Label>
              <Select
                required
                value={formData.tipo_militar}
                onValueChange={(value) => setFormData({ ...formData, tipo_militar: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuzileiro Naval">Fuzileiro Naval</SelectItem>
                  <SelectItem value="Guarda Costeiro">Guarda Costeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local_servico">Local de Serviço *</Label>
              <Select
                required
                value={formData.local_servico}
                onValueChange={(value) => setFormData({ ...formData, local_servico: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guarda Costeira">Guarda Costeira</SelectItem>
                  <SelectItem value="Exército">Exército</SelectItem>
                  <SelectItem value="Palácio do Governo">Palácio do Governo</SelectItem>
                  <SelectItem value="Bombeiros">Bombeiros</SelectItem>
                  <SelectItem value="Polícia">Polícia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cursando">Cursando</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Reprovado">Reprovado</SelectItem>
                  <SelectItem value="Desligado">Desligado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
