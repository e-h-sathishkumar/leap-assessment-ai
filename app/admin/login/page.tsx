"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    console.log("Admin Logged In:", data.user);

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <ShieldCheck className="h-8 w-8 text-purple-700" />
          </div>

          <h1 className="text-3xl font-bold">
            Administrator Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to manage your institution, users, assessments and reports.
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@leap.ai"
              className="w-full rounded-lg border px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Login
          </button>

        </form>

        <div className="mt-6 flex items-center justify-between text-sm">

          <Link
            href="/admin/register"
            className="text-purple-700 hover:underline"
          >
            Register
          </Link>

          <Link
            href="/admin/forgot-password"
            className="text-purple-700 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <div className="mt-8 text-center">

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={18} />
            Back to Administrator Portal
          </Link>

        </div>

      </div>

    </main>
  );
}