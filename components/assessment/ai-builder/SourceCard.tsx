"use client";

import { Button } from "@/components/ui/button";

interface SourceCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
}

export default function SourceCard({
  title,
  description,
  icon,
  onClick,
}: SourceCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">

      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm text-slate-500">
        {description}
      </p>

      <Button
        className="mt-6 w-full"
        onClick={onClick}
      >
        Continue
      </Button>

    </div>
  );
}