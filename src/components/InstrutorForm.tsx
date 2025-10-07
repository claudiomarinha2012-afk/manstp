import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InstrutorFormProps {
  instrutor?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InstrutorForm({ instrutor, onSuccess, onCancel }: InstrutorFormProps) {
  const [formData, setFormData] = useState({
    nome_completo: instrutor?.nome_completo || "",
    graduacao: instrutor?.graduacao || "",
    tipo_militar: instrutor?.tipo_militar || "",
    especialidade: instrutor?.especialidade || "",
    telefone: instrutor?.telefone || "",
    email: instrutor?.email || "",
    observacoes: instrutor?.observacoes || "",
  });

  const graduacoes = [
    "Brigadeiro",
    "Coronel",
    "Capitão de Mar e Guerra",
    "Tenente Coronel",
    "Capitão de Fragata",
    "Major",
    "Capitão Tenente",
    "Capitão",
    "Primeiro Tenente",
    "Tenente",
    "Segundo Tenente",
    "Alferes",
    "Guarda Marinha",
    "Aspirante",
    "Sargento Mor",
    "Sargento Chefe",
    "Sargento Ajudante",
    "Primeiro Sargento",
    "Segundo Sargento",
    "Furriel",
    "Primeiro Subsargento",
    "Segundo Furriel",
    "Subsargento",
    "Cabo de Seção",
    "Cabo",
    "Segundo Cabo",
    "Segundo Marinheiro",
    "Soldado",
    "Grumete",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (instrutor) {
      const { error } = await supabase
        .from("instrutores")
        .update(formData)
        .eq("id", instrutor.id);

      if (error) {
        toast.error("Erro ao atualizar instrutor");
        return;
      }
      toast.success("Instrutor atualizado com sucesso!");
    } else {
      const { error } = await supabase
        .from("instrutores")
        .insert([{ ...formData, user_id: user.id }]);

      if (error) {
        toast.error("Erro ao cadastrar instrutor");
        return;
      }
      toast.success("Instrutor cadastrado com sucesso!");
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome_completo">Nome Completo *</Label>
        <Input
          id="nome_completo"
          value={formData.nome_completo}
          onChange={(e) =>
            setFormData({ ...formData, nome_completo: e.target.value })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="graduacao">Graduação *</Label>
        <Select
          value={formData.graduacao}
          onValueChange={(value) =>
            setFormData({ ...formData, graduacao: value })
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a graduação" />
          </SelectTrigger>
          <SelectContent>
            {graduacoes.map((grad) => (
              <SelectItem key={grad} value={grad}>
                {grad}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tipo_militar">Tipo Militar *</Label>
        <Select
          value={formData.tipo_militar}
          onValueChange={(value) =>
            setFormData({ ...formData, tipo_militar: value })
          }
          required
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

      <div>
        <Label htmlFor="especialidade">Especialidade</Label>
        <Input
          id="especialidade"
          value={formData.especialidade}
          onChange={(e) =>
            setFormData({ ...formData, especialidade: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={(e) =>
            setFormData({ ...formData, telefone: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) =>
            setFormData({ ...formData, observacoes: e.target.value })
          }
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {instrutor ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}