"use client";

import { Input } from "@/components/ui/input";

interface ChapterSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ChapterSearch({
  value,
  onChange,
}: ChapterSearchProps) {
  return (
    <Input
      placeholder="🔍 Search chapters..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-md"
    />
  );
}