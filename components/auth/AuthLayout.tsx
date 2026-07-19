import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  accentColor: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  accentColor,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${accentColor}`}
          >
              LEAP
          </div>

          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="mt-2 text-slate-500">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}