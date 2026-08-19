"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AttemptWorkspace from "@/components/online-test/AttemptWorkspace";

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();

  const testId = String(params.id);
  const attemptId = String(params.attemptId);

  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAttempt() {
      try {
        setLoading(true);
        setError("");

        // ==========================================
        // AUTHENTICATED STUDENT
        // ==========================================

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw new Error(authError.message);
        }

        if (!user) {
          router.replace("/student/login");
          return;
        }

        console.log("======================================");
        console.log("LOADING STUDENT ATTEMPT");
        console.log("Student:", user.id);
        console.log("Test ID:", testId);
        console.log("Attempt ID:", attemptId);
        console.log("======================================");

        // ==========================================
        // LOAD ATTEMPT
        // ==========================================

        const { data, error: attemptError } =
          await supabase
            .from("test_attempts")
            .select(`
              *,
              tests(
                *,
                subjects(
                  id,
                  name
                ),
                test_questions(
                  id,
                  question_order,
                  marks,
                  negative_marks,
                  questions(
                    *,
                    chapters(
                      id,
                      name
                    )
                  )
                )
              )
            `)
            .eq("id", attemptId)
            .single();

        if (attemptError) {
          console.error(
            "ATTEMPT LOAD ERROR:",
            attemptError
          );

          throw new Error(
            attemptError.message ||
              "Unable to load test attempt."
          );
        }

        if (!data) {
          throw new Error(
            "Test attempt was not found."
          );
        }

        // ==========================================
        // VERIFY TEST
        // ==========================================

        if (
          Number(data.test_id) !==
          Number(testId)
        ) {
          throw new Error(
            "This attempt does not belong to this test."
          );
        }

        // ==========================================
        // COMPLETED TEST
        // ==========================================

        if (data.status === "Completed") {
          router.replace(
            `/online-test/${testId}/result/${attemptId}`
          );

          return;
        }

        // ==========================================
        // SORT QUESTIONS
        // ==========================================

        if (
          data.tests?.test_questions
        ) {
          data.tests.test_questions.sort(
            (a: any, b: any) =>
              Number(a.question_order) -
              Number(b.question_order)
          );
        }

        console.log(
          "QUESTIONS:",
          data.tests?.test_questions?.length ?? 0
        );

        console.log(
          "ATTEMPT LOADED SUCCESSFULLY"
        );

        if (mounted) {
          setAttempt(data);
        }
      } catch (err) {
        console.error(
          "LOAD ATTEMPT ERROR:",
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the test."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAttempt();

    return () => {
      mounted = false;
    };
  }, [
    attemptId,
    testId,
    router,
  ]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-10 py-8 shadow-lg">
          <p className="text-lg font-semibold text-slate-700">
            Loading test...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-red-700">
            Unable to Open Test
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/student/dashboard"
              )
            }
            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // NO ATTEMPT
  // ==========================================

  if (!attempt) {
    return null;
  }

  // ==========================================
  // ACTUAL EXAM
  // ==========================================

  return (
    <AttemptWorkspace
      attempt={attempt}
    />
  );
}

