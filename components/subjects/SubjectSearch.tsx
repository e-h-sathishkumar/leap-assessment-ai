"use client";

import { Input } from "@/components/ui/input";

interface SubjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectSearch({
  value,
  onChange,
}: SubjectSearchProps) {
  return (
    <Input
      placeholder="🔍 Search subjects..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-md"
    />
  );
}