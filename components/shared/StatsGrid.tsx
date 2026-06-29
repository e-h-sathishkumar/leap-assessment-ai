import { ReactNode } from "react";

interface StatsGridProps {
  children: ReactNode;
}

export default function StatsGrid({
  children,
}: StatsGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}