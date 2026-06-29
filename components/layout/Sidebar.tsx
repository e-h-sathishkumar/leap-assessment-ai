"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileQuestion,
  ClipboardList,
  CalendarClock,
  Trophy,
  Users,
  BarChart3,
  BrainCircuit,
  Settings,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    title: "GENERAL",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "REPOSITORY",
    items: [
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
    ],
  },

  {
    title: "ASSESSMENT",
    items: [
      {
        title: "Dashboard",
        href: "/assessment",
        icon: ClipboardList,
      },
      {
        title: "Create Test",
        href: "/assessment/create",
        icon: ClipboardList,
      },
      {
        title: "Draft Tests",
        href: "/assessment/drafts",
        icon: ClipboardList,
      },
      {
        title: "Published",
        href: "/assessment/published",
        icon: Trophy,
      },
      {
        title: "Scheduled",
        href: "/assessment/scheduled",
        icon: CalendarClock,
      },
      {
        title: "Results",
        href: "/assessment/results",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
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
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen border-r border-slate-800 overflow-y-auto">
      <div className="h-20 flex items-center justify-center border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">
            LEAP AI
          </h1>

          <p className="text-xs text-slate-400">
            NEET • JEE Assessment
          </p>
        </div>
      </div>

      <nav className="p-4">

        {menuGroups.map((group) => (
          <div key={group.title} className="mb-6">

            <p className="px-3 mb-2 text-[11px] font-semibold tracking-widest uppercase text-slate-500">
              {group.title}
            </p>

            <div className="space-y-1">

              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                      active
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon size={19} />

                    <span className="text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                );
              })}

            </div>
          </div>
        ))}

      </nav>
    </aside>
  );
}