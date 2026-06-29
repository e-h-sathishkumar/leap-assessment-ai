"use client";

import { Input } from "@/components/ui/input";

interface TopicSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicSearch({
  value,
  onChange,
}: TopicSearchProps) {
  return (
    <Input
      placeholder="🔍 Search topics..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-md"
    />
  );
}