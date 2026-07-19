import { supabase } from "@/lib/supabase";

export type UserRole =
  | "school"
  | "teacher"
  | "student";

export interface LoginResult {
  success: boolean;
  message?: string;
  role?: UserRole;
}

export async function login(
  email: string,
  password: string,
  expectedRole: UserRole
): Promise<LoginResult> {

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? "Invalid credentials",
    };
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

  if (profileError || !profile) {

    await supabase.auth.signOut();

    return {
      success: false,
      message: "Profile not found.",
    };
  }

  if (profile.role !== expectedRole) {

    await supabase.auth.signOut();

    return {
      success: false,
      message:
        `You are not authorized to access the ${expectedRole} portal.`,
    };
  }

  return {
    success: true,
    role: profile.role,
  };
}

export async function logout() {
  return supabase.auth.signOut();
}

export async function currentUser() {
  return supabase.auth.getUser();
}