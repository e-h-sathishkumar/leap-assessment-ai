"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

type LoginFormProps = {
  portal: "student" | "teacher" | "school";
  accentButton: string;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export default function LoginForm({
  portal,
  accentButton,
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3 font-semibold text-white transition ${accentButton}`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm">
        <Link
          href={`/${portal}/register`}
          className="text-blue-600 hover:underline"
        >
          Register
        </Link>

        <Link
          href={`/${portal}/forgot-password`}
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
    </>
  );
}