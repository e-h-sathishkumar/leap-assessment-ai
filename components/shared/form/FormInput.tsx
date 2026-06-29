"use client";

// ====================================================
// Component : FormInput
// Module    : Shared Form Components
// Purpose   : Reusable text input
// ====================================================

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  type = "text",
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </Label>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}