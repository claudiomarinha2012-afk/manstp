import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface CardConfig {
  id: string;
  title: string;
  countFrom: "aluno_turma" | "instrutores" | "cursos" | "turmas" | "alunos_unicos";
}

interface CardConfigDialogProps {
  config: CardConfig;
  onSave: (config: CardConfig) => void;
}

export const CardConfigDialog = ({ config, onSave }: CardConfigDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(config.title);
  const [countFrom, setCountFrom] = useState(config.countFrom);

  const handleSave = () => {
    onSave({
      ...config,
      title,
      countFrom,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 hover:opacity-100">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Card</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countFrom">Contar De</Label>
            <Select value={countFrom} onValueChange={(value: any) => setCountFrom(value)}>
              <SelectTrigger id="countFrom">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluno_turma">Inscrições (aluno_turma)</SelectItem>
                <SelectItem value="alunos_unicos">Alunos Únicos</SelectItem>
                <SelectItem value="instrutores">Instrutores</SelectItem>
                <SelectItem value="cursos">Cursos</SelectItem>
                <SelectItem value="turmas">Turmas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
