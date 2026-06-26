"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileQuestion,
  ClipboardList,
  Users,
  BarChart3,
  BrainCircuit,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Subjects",
    href: "/repository/subjects",
    icon: BookOpen,
  },
  {
    title: "Chapters",
    href: "/repository/chapters",
    icon: FolderTree,
  },
  {
    title: "Topics",
    href: "/repository/topics",
    icon: FolderTree,
  },
  {
    title: "Questions",
    href: "/repository/questions",
    icon: FileQuestion,
  },
  {
    title: "Tests",
    href: "/tests",
    icon: ClipboardList,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    href: "/ai",
    icon: BrainCircuit,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen border-r border-slate-800">
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">
            LEAP AI
          </h1>
          <p className="text-xs text-slate-400">
            NEET • JEE Assessment
          </p>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}