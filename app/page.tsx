import Image from "next/image";

import {
  GraduationCap,
  UserRound,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* ================= Navigation ================= */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

         <div>
  <h1 className="text-3xl font-extrabold text-blue-700">
    LEAP
  </h1>

  <p className="-mt-1 text-xs tracking-[5px] text-slate-500">
    ASSESSMENT AI
  </p>
</div>
          <div className="space-x-6 text-sm font-medium text-slate-600">

            <a
              href="#features"
              className="hover:text-blue-700"
            >
              Features
            </a>

            <a
              href="/contact"
              className="hover:text-blue-700"
            >
              Support
            </a>
<a
  href="/assessment/create"
  className="rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-800"
>
  Get Started
</a>
          </div>

        </div>

      </nav>

      {/* ================= Hero ================= */}

      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white">

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-8 py-12 lg:grid-cols-2">

          {/* Left */}

          <div>
<p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-blue-300">
  AI • ASSESSMENT • ANALYTICS • LEARNING
</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">

              LEAP AI Assessment

              <span className="block text-blue-300">
                JEE • NEET • CBSE
              </span>

            </h1>

            <p className="mt-5 text-xl font-medium text-blue-200">

              AI-Powered Assessment Platform

              <br />

              for Schools, Teachers and Students

            </p>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">

              Create intelligent assessments, generate AI-powered
              questions, build smart repositories and deliver
              meaningful learning analytics—all from one unified
              platform.

            </p>
<div className="mt-8 flex flex-wrap gap-8">

  <div>
    <h2 className="text-3xl font-bold text-white">
      AI
    </h2>
    <p className="text-blue-200">
      Question Generator
    </p>
  </div>

  <div>
    <h2 className="text-3xl font-bold text-white">
      24×7
    </h2>
    <p className="text-blue-200">
      Intelligent Platform
    </p>
  </div>

  <div>
    <h2 className="text-3xl font-bold text-white">
      NEET
    </h2>
    <p className="text-blue-200">
      JEE • CBSE
    </p>
  </div>

</div>
          </div>

          {/* Right */}

          <div className="flex justify-center">

            <Image
              src="/images/hero-ai.png"
              alt="LEAP AI Dashboard"
              width={650}
              height={650}
              priority
              quality={100}
              className="w-full max-w-lg rounded-2xl shadow-2xl transition duration-500 hover:scale-105"
            />

          </div>

        </div>

      </section>
{/* ================= Portal Section ================= */}

<section className="mx-auto max-w-7xl px-8 py-8">

  <div className="mb-8 text-center">

    <h2 className="text-3xl font-bold text-slate-900">
      Choose Your Portal
    </h2>

    <p className="mt-2 text-slate-600">
      Select your role to continue.
    </p>

  </div>

  <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">

    {/* ================= School ================= */}

    <a
      href="/school"
      className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-xl"
    >

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">

        <ShieldCheck
          size={34}
          className="text-violet-700"
        />

      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        School
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Manage Institution
      </p>

    </a>

    {/* ================= Teacher ================= */}

    <a
      href="/teacher"
      className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
    >

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">

        <GraduationCap
          size={34}
          className="text-blue-700"
        />

      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        Teacher
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Create Assessments
      </p>

    </a>

    {/* ================= Student ================= */}

    <a
      href="/student"
      className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-500 hover:shadow-xl"
    >

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

        <UserRound
          size={34}
          className="text-green-700"
        />

      </div>

      <h3 className="mt-4 text-xl font-bold text-slate-900">
        Student
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Take Assessments
      </p>

    </a>

  </div>
<footer className="mt-12 border-t py-8">

  <p className="text-center text-sm text-slate-500">
    © 2026 LEAP Assessment AI
    <br />
    Empowering Teachers • Inspiring Students • Enabling Schools
  </p>

</footer>
</section>
</main>
  );
}