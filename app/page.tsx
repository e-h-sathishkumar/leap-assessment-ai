"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const portals = [
  {
    title: "Teacher",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    link: "/teacher/login",
  },
  {
    title: "Student",
    icon: GraduationCap,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    color: "bg-emerald-600",
    hoverColor: "hover:bg-emerald-700",
    link: "/student/login",
  },
  {
    title: "Administrator",
    icon: ShieldCheck,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    color: "bg-violet-600",
    hoverColor: "hover:bg-violet-700",
    link: "/admin/login",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#090D16] via-[#0C1220] to-[#090D16] text-white flex flex-col">
{/* ================= Navbar ================= */}

<nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

    <Link href="/" className="flex items-center">
  <Image
    src="/images/leapai-logo.png"
    alt="LEAP Assessment AI"
    width={320}
    height={90}
    priority
    className="h-16 w-auto object-contain"
  />
</Link>

    {/* Future Navigation */}
    {/* <div className="flex gap-8">
      ...
    </div> */}

  </div>
</nav>
      {/* ================= Hero ================= */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8">

              <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span className="text-blue-500">LEAP</span>
                <br />
                Assessment AI
              </h1>

              <h2 className="text-2xl font-semibold text-blue-400">
                AI-Powered NEET • JEE • CBSE Assessment Platform
              </h2>

              <p className="text-lg text-slate-300">
                Create • Assess • Analyze • Improve
              </p>

            </div>

            {/* Right */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/images/hero.png"
                width={650}
                height={480}
                priority
                alt="LEAP Assessment AI"
                className="rounded-3xl border border-blue-500/20 shadow-[0_0_60px_rgba(37,99,235,0.20)]"
              />
            </div>

          </div>

        </div>
      </section>

      {/* ================= Portal Heading ================= */}
{/* ================= Portal Heading ================= */}
<section className="-mt-2">
  <div className="mx-auto max-w-7xl px-8 text-center">

    <h2 className="text-3xl font-bold">
      Choose Your Portal
    </h2>

    <div className="mx-auto mt-3 mb-10 h-1 w-24 rounded-full bg-blue-500"></div>

  </div>
</section>

      {/* ================= Portal Cards ================= */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-8">

          <div className="grid gap-8 md:grid-cols-3">

            {portals.map((portal) => (
              <div
                key={portal.title}
                className="rounded-3xl bg-white p-8 text-center text-slate-900 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(37,99,235,0.25)]"
              >

                <div
                  className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full ${portal.iconBg}`}
                >
                  <portal.icon
                    className={`h-12 w-12 ${portal.iconColor}`}
                  />
                </div>

                <h3 className="mb-8 text-3xl font-bold">
                  {portal.title}
                </h3>

                <Link
                  href={portal.link}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-all duration-300 ${portal.color} ${portal.hoverColor}`}
                >
                  Open Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="mt-auto border-t border-slate-800 py-6">
        <div className="mx-auto max-w-7xl px-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">

          <p>
            © {new Date().getFullYear()} LEAP Assessment AI. All Rights Reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Version 1.0 • PSG Public Schools
          </p>

        </div>
      </footer>

    </main>
  );
}