"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

interface EntitySelectProps<T> {
  label: string;
  placeholder?: string;
  value: string;
  options: T[];
  optionLabel: keyof T;
  optionValue: keyof T;
  onChange: (value: string) => void;
}

export default function EntitySelect<T>({
  label,
  placeholder = "Select",
  value,
  options,
  optionLabel,
  optionValue,
  onChange,
}: EntitySelectProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={placeholder}
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((item, index) => (
            <SelectItem
              key={index}
              value={String(item[optionValue])}
            >
              {String(item[optionLabel])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}