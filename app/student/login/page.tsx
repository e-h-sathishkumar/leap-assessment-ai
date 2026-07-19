import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function StudentLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <GraduationCap className="h-8 w-8 text-green-700" />
          </div>

          <h1 className="text-3xl font-bold">
            Student Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to access your assessments and results.
          </p>

        </div>

        <form className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 focus:border-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Login
          </button>

        </form>

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