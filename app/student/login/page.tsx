"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import { login } from "@/services/auth/auth.service";

export default function StudentLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        email.trim(),
        password,
        "student"
      );

      if (!result.success) {
        setError(
          result.message ??
            "Unable to sign in."
        );
        return;
      }

      router.replace("/student/dashboard");
      router.refresh();
    } catch (err) {
      console.error(
        "Student login error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <GraduationCap className="h-8 w-8 text-green-700" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Student Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to access your
            assessments and results.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
            />

          </div>

          {/* Password */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Signing in...
              </>
            ) : (
              "Login"
            )}

          </button>

        </form>

        {/* Links */}

        <div className="mt-6 flex items-center justify-between text-sm">

          <Link
            href="/student/register"
            className="text-green-700 hover:underline"
          >
            Register
          </Link>

          <Link
            href="/student/forgot-password"
            className="text-green-700 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Back */}

        <div className="mt-8 text-center">

          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={18} />

            Back to Student Portal
          </Link>

        </div>

      </div>

    </main>
  );
}