"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        setLoading(false);
        return;
      }

      // Go to student login after successful logout
      router.replace("/student/login");
      router.refresh();

    } catch (error) {
      console.error("Unexpected logout error:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-slate-300
        bg-white
        px-4
        py-2
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        transition
        hover:bg-slate-50
        hover:text-red-600
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ? (
        <>
          <Loader2
            className="h-4 w-4 animate-spin"
          />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </button>
  );
}