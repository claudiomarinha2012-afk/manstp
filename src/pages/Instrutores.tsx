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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Instrutores</h1>
        {isCoordenador && (
          <Button
            onClick={() => {
              setSelectedInstrutor(null);
              setIsDialogOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Instrutor
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Nome</TableHead>
              <TableHead className="min-w-[120px]">Graduação</TableHead>
              <TableHead className="min-w-[140px]">Tipo</TableHead>
              <TableHead className="min-w-[130px] hidden md:table-cell">Especialidade</TableHead>
              <TableHead className="min-w-[150px] hidden lg:table-cell">Contato</TableHead>
              <TableHead className="text-right min-w-[100px]">Ações</TableHead>
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
                  <TableCell className="font-medium text-sm">
                    {instrutor.nome_completo}
                  </TableCell>
                  <TableCell className="text-sm">{instrutor.graduacao}</TableCell>
                  <TableCell>
                    <Badge
                      className="text-xs"
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
                  <TableCell className="hidden md:table-cell text-sm">{instrutor.especialidade || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-xs">
                      {instrutor.telefone && <div>{instrutor.telefone}</div>}
                      {instrutor.email && (
                        <div className="text-muted-foreground truncate max-w-[200px]">
                          {instrutor.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isCoordenador && (
                      <div className="flex justify-end gap-1 sm:gap-2">
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
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