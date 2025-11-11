import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Plus } from "lucide-react";

export type DashboardCardType = 
  | "coppaznav"
  | "ead"
  | "cenpem"
  | "expeditos_stp"
  | "efomm_ciaga"
  | "efomm_ciaba"
  | "rov_eb"
  | "custom";

export interface CustomFilter {
  nomeCurso?: string;
  tipoCurso?: string;
  modalidade?: string;
  localCurso?: string;
  siglaCurso?: string;
}

interface DashboardCardConfigData {
  id: string;
  type: DashboardCardType;
  titulo: string;
  customFilter?: CustomFilter;
}

interface DashboardCardConfigProps {
  config: DashboardCardConfigData;
  onSave: (config: DashboardCardConfigData) => void;
}

export const DashboardCardConfig = ({ config, onSave }: DashboardCardConfigProps) => {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState(config.titulo);
  const [type, setType] = useState(config.type);
  const [customFilter, setCustomFilter] = useState<CustomFilter>(config.customFilter || {});

  const handleSave = () => {
    onSave({
      ...config,
      titulo,
      type,
      customFilter: type === "custom" ? customFilter : undefined,
    });
    setOpen(false);
  };

  const updateCustomFilter = (field: keyof CustomFilter, value: string) => {
    setCustomFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent absolute top-2 right-2">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configurar título e tipo de contagem</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Card do Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[600px] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Card</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Contagem</Label>
            <Select value={type} onValueChange={(value: DashboardCardType) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coppaznav">COPPAZNAV</SelectItem>
                <SelectItem value="ead">Cursos a Distância (EAD)</SelectItem>
                <SelectItem value="cenpem">Cursos CENPEM</SelectItem>
                <SelectItem value="expeditos_stp">Cursos Expeditos STP</SelectItem>
                <SelectItem value="efomm_ciaga">EFOMM CIAGA</SelectItem>
                <SelectItem value="efomm_ciaba">EFOMM CIABA</SelectItem>
                <SelectItem value="rov_eb">ROV - EB</SelectItem>
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Personalizado (definir critérios)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "custom" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Defina os critérios de busca. Os cursos serão contados se contiverem qualquer uma das palavras-chave especificadas (busca case-insensitive).
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="nomeCurso">Nome do Curso (palavras-chave)</Label>
                <Textarea
                  id="nomeCurso"
                  value={customFilter.nomeCurso || ""}
                  onChange={(e) => updateCustomFilter("nomeCurso", e.target.value)}
                  placeholder="Ex: mergulho, navegação, comunicações"
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siglaCurso">Sigla do Curso</Label>
                <Input
                  id="siglaCurso"
                  value={customFilter.siglaCurso || ""}
                  onChange={(e) => updateCustomFilter("siglaCurso", e.target.value)}
                  placeholder="Ex: CMG, CNG"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoCurso">Tipo de Curso</Label>
                <Input
                  id="tipoCurso"
                  value={customFilter.tipoCurso || ""}
                  onChange={(e) => updateCustomFilter("tipoCurso", e.target.value)}
                  placeholder="Ex: aperfeiçoamento, especialização"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Input
                  id="modalidade"
                  value={customFilter.modalidade || ""}
                  onChange={(e) => updateCustomFilter("modalidade", e.target.value)}
                  placeholder="Ex: presencial, híbrido, EAD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localCurso">Local do Curso</Label>
                <Input
                  id="localCurso"
                  value={customFilter.localCurso || ""}
                  onChange={(e) => updateCustomFilter("localCurso", e.target.value)}
                  placeholder="Ex: Rio de Janeiro, Brasília"
                />
              </div>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            Salvar Configuração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
