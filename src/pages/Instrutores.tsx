import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InstrutorForm } from "@/components/InstrutorForm";
import { useUserRole } from "@/hooks/useUserRole";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Instrutores() {
  const { isCoordenador } = useUserRole();
  const [instrutores, setInstrutores] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInstrutor, setSelectedInstrutor] = useState<any>(null);

  useEffect(() => {
    fetchInstrutores();
  }, []);

  const fetchInstrutores = async () => {
    const { data, error } = await supabase
      .from("instrutores")
      .select("*")
      .order("nome_completo");

    if (error) {
      toast.error("Erro ao carregar instrutores");
      return;
    }

    setInstrutores(data || []);
  };

  const handleEdit = (instrutor: any) => {
    setSelectedInstrutor(instrutor);
    setIsDialogOpen(true);
  };

  const handleDelete = (instrutor: any) => {
    setSelectedInstrutor(instrutor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInstrutor) return;

    const { error } = await supabase
      .from("instrutores")
      .delete()
      .eq("id", selectedInstrutor.id);

    if (error) {
      toast.error("Erro ao excluir instrutor");
      return;
    }

    toast.success("Instrutor excluído com sucesso!");
    setIsDeleteDialogOpen(false);
    setSelectedInstrutor(null);
    fetchInstrutores();
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedInstrutor(null);
    fetchInstrutores();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instrutores</h1>
        {isCoordenador && (
          <Button
            onClick={() => {
              setSelectedInstrutor(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Instrutor
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Graduação</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instrutores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum instrutor cadastrado
                </TableCell>
              </TableRow>
            ) : (
              instrutores.map((instrutor) => (
                <TableRow key={instrutor.id}>
                  <TableCell className="font-medium">
                    {instrutor.nome_completo}
                  </TableCell>
                  <TableCell>{instrutor.graduacao}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        instrutor.tipo_militar === "Fuzileiro Naval" ? "default" :
                        instrutor.tipo_militar === "Guarda Costeiro" ? "secondary" :
                        instrutor.tipo_militar === "Exercito" ? "outline" :
                        "destructive"
                      }
                    >
                      {instrutor.tipo_militar}
                    </Badge>
                  </TableCell>
                  <TableCell>{instrutor.especialidade || "-"}</TableCell>
                  <TableCell>
                    {instrutor.telefone && <div>{instrutor.telefone}</div>}
                    {instrutor.email && (
                      <div className="text-sm text-muted-foreground">
                        {instrutor.email}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isCoordenador && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(instrutor)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(instrutor)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedInstrutor ? "Editar Instrutor" : "Novo Instrutor"}
            </DialogTitle>
          </DialogHeader>
          <InstrutorForm
            instrutor={selectedInstrutor}
            onSuccess={handleSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Instrutor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o instrutor {selectedInstrutor?.nome_completo}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}