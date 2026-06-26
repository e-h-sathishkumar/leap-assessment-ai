"use client";

import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          LEAP AI | NEET-JEE Assessment
        </h1>

        <p className="text-sm text-slate-500">
          AI Powered Academic Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Search size={20} />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <UserCircle2 size={24} />
          <span className="text-sm font-medium">
            Administrator
          </span>
        </div>
      </div>
    </header>
  );
}