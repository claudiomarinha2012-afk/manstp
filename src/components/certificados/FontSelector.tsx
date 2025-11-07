import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const AVAILABLE_FONTS = [
  { name: "Arial", value: "Arial" },
  { name: "Calibri", value: "Calibri" },
  { name: "Carlito", value: "Carlito" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Courier New", value: "Courier New" },
  { name: "Georgia", value: "Georgia" },
  { name: "Verdana", value: "Verdana" },
  { name: "Tahoma", value: "Tahoma" },
  { name: "Trebuchet MS", value: "Trebuchet MS" },
  { name: "Lucida Sans", value: "Lucida Sans" },
  { name: "Palatino", value: "Palatino" },
  { name: "Garamond", value: "Garamond" },
  { name: "Comic Sans MS", value: "Comic Sans MS" },
  { name: "Impact", value: "Impact" },
];

export const FontSelector = ({ value, onChange }: FontSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Fonte do Texto</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma fonte" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_FONTS.map((font) => (
            <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
