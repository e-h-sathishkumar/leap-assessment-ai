import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
        {children}
      </div>
    </main>
  );
}