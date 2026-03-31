import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

interface SelectItemsProps {
  placeholder?: string;
  label?: string;
  items: {
    name: string;
    value: string;
  }[];
  value?: string;
  onValueChange: (value: string) => void;
  defaultValue?: string;
}

export function SelectItems({ defaultValue, placeholder, label, items, value, onValueChange }: SelectItemsProps) {
  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange?.(defaultValue || "");
  }

  return (
    <div className="relative w-full">
      <Select value={value || defaultValue || ""} onValueChange={(v) => onValueChange?.(v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {value && (
        <Button
          type="button"
          onClick={clear}
          variant={'ghost'}
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}