"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Test {
  id: number;
  title: string;
  exam: string;
  class_name: string | null;
  subject_id: number | null;
  chapter_id: number | null;
  topic_id: number | null;
  duration_minutes: number;
  total_marks: number;
  total_questions: number;
  negative_marks: number | null;
  instructions: string | null;
  description: string | null;
  question_type: string | null;
  difficulty: string | null;
  test_type: string | null;
  status: string | null;
  start_time: string | null;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string | null;
}

interface Chapter {
  id: number;
  name: string;
  description?: string | null;
}

interface Topic {
  id: number;
  name: string;
  description?: string | null;
}

interface Question {
  id: number;
  question_text: string;
  question_type: string | null;
  difficulty: string | null;
  marks: number | null;
  negative_marks: number | null;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string | null;
  explanation?: string | null;
  hint?: string | null;
  learning_objective?: string | null;
  tags?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  source_type?: string | null;
  generated_by?: string | null;
  ai_model?: string | null;
  isNew?: boolean;
}

interface EditableQuestion extends Question {
  tempId?: string;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function TestQuestionBuilderPage() {
  const router = useRouter();
  const params = useParams();

  const testId = Number(params.testId);

  /* ==========================================================
     PAGE STATE
  ========================================================== */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [test, setTest] = useState<Test | null>(null);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);

  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const [existingQuestionIds, setExistingQuestionIds] = useState<number[]>(
    []
  );

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(
    []
  );

  /* ==========================================================
     TEST EDIT STATE
  ========================================================== */

  const [editTest, setEditTest] = useState(false);

  const [title, setTitle] = useState("");
  const [exam, setExam] = useState("");
  const [className, setClassName] = useState("");
  const [duration, setDuration] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [startTime, setStartTime] = useState("");

  /* ==========================================================
     AI STATE
  ========================================================== */

  const [questionType, setQuestionType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState("Medium");
  const [aiQuestionCount, setAiQuestionCount] = useState(2);

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const [search, setSearch] = useState("");
  const [bankDifficulty, setBankDifficulty] = useState("All");

  /* ==========================================================
     EDIT QUESTION
  ========================================================== */

  const [editingQuestionId, setEditingQuestionId] = useState<
    number | string | null
  >(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ==========================================================
     LOAD TEST
  ========================================================== */

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/teacher/login");
          return;
        }

        if (!testId || Number.isNaN(testId)) {
          setError("Invalid test ID.");
          return;
        }

        const { data, error: testError } = await supabase
          .from("tests")
          .select(`
            id,
            title,
            exam,
            class_name,
            subject_id,
            chapter_id,
            topic_id,
            duration_minutes,
            total_marks,
            total_questions,
            negative_marks,
            instructions,
            description,
            question_type,
            difficulty,
            test_type,
            status,
            start_time
          `)
          .eq("id", testId)
          .single();

        if (testError) {
          console.error(testError);
          setError(testError.message);
          return;
        }

        if (!data) {
          setError("Test not found.");
          return;
        }

        setTest(data);

        setTitle(data.title || "");
        setExam(data.exam || "");
        setClassName(data.class_name || "");
        setDuration(data.duration_minutes || 0);
        setTotalMarks(data.total_marks || 0);
        setTotalQuestions(data.total_questions || 0);
        setNegativeMarks(Number(data.negative_marks || 0));
        setQuestionType(data.question_type || "MCQ");
        setDifficulty(data.difficulty || "Medium");

        if (data.start_time) {
          const localDate = new Date(data.start_time);

          const yyyy = localDate.getFullYear();
          const mm = String(localDate.getMonth() + 1).padStart(2, "0");
          const dd = String(localDate.getDate()).padStart(2, "0");
          const hh = String(localDate.getHours()).padStart(2, "0");
          const min = String(localDate.getMinutes()).padStart(2, "0");

          setStartTime(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
        }

        /* ------------------------------------------------------
           SUBJECT
        ------------------------------------------------------ */

        if (data.subject_id) {
          const { data: subjectData } = await supabase
            .from("subjects")
            .select("id, name, code, description")
            .eq("id", data.subject_id)
            .single();

          if (subjectData) {
            setSubject(subjectData);
          }
        }

        /* ------------------------------------------------------
           CHAPTER
        ------------------------------------------------------ */

        if (data.chapter_id) {
          const { data: chapterData } = await supabase
            .from("chapters")
            .select("id, name, description")
            .eq("id", data.chapter_id)
            .single();

          if (chapterData) {
            setChapter(chapterData);
          }
        }

        /* ------------------------------------------------------
           TOPIC
        ------------------------------------------------------ */

        if (data.topic_id) {
          const { data: topicData } = await supabase
            .from("topics")
            .select("id, name, description")
            .eq("id", data.topic_id)
            .single();

          if (topicData) {
            setTopic(topicData);
          }
        }

        /* ------------------------------------------------------
           EXISTING TEST QUESTIONS
        ------------------------------------------------------ */

        const { data: links, error: linksError } = await supabase
          .from("test_questions")
          .select("question_id")
          .eq("test_id", data.id)
          .order("question_order", { ascending: true });

        if (linksError) {
          console.error(linksError);
        }

        const ids = (links || []).map((item) => item.question_id);

        setExistingQuestionIds(ids);

        /* ------------------------------------------------------
           LOAD EXISTING QUESTION CONTENT
        ------------------------------------------------------ */

        if (ids.length > 0) {
          const { data: existingQuestions, error: questionError } =
            await supabase
              .from("questions")
              .select(`
                id,
                question_text,
                question_type,
                difficulty,
                marks,
                negative_marks,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                explanation,
                hint,
                learning_objective,
                tags,
                status,
                is_active,
                source_type,
                generated_by,
                ai_model
              `)
              .in("id", ids);

          if (questionError) {
            console.error(questionError);
          } else {
            const ordered = ids
              .map((id) =>
                (existingQuestions || []).find(
                  (question) => question.id === id
                )
              )
              .filter(Boolean) as EditableQuestion[];

            setQuestions(ordered);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load test.");
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [router, testId]);

  /* ==========================================================
     LOAD QUESTION BANK
  ========================================================== */

  useEffect(() => {
    async function loadBankQuestions() {
      if (
        !test?.subject_id ||
        !test?.chapter_id ||
        !test?.topic_id
      ) {
        return;
      }

      try {
        let query = supabase
          .from("questions")
          .select(`
            id,
            question_text,
            question_type,
            difficulty,
            marks,
            negative_marks,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            explanation,
            hint,
            learning_objective,
            tags,
            status,
            is_active,
            source_type,
            generated_by,
            ai_model
          `)
          .eq("subject_id", test.subject_id)
          .eq("chapter_id", test.chapter_id)
          .eq("topic_id", test.topic_id)
          .eq("is_active", true)
          .order("id", { ascending: false });

        if (bankDifficulty !== "All") {
          query = query.eq("difficulty", bankDifficulty);
        }

        const { data, error: bankError } = await query;

        if (bankError) {
          console.error(bankError);
          return;
        }

        /*
         * Don't duplicate questions already loaded
         * into the test.
         */
        const existingIds = new Set(
          questions
            .filter((q) => q.id)
            .map((q) => q.id)
        );

        const bankOnly = (data || []).filter(
          (question) => !existingIds.has(question.id)
        );

        setBankQuestions(bankOnly);
      } catch (err) {
        console.error(err);
      }
    }

    loadBankQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, bankDifficulty]);

  const [bankQuestions, setBankQuestions] = useState<EditableQuestion[]>(
    []
  );

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredBankQuestions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return bankQuestions;
    }

    return bankQuestions.filter((question) =>
      question.question_text.toLowerCase().includes(value)
    );
  }, [bankQuestions, search]);

  /* ==========================================================
     UPDATE TEST
  ========================================================== */

  async function saveTestDetails() {
    if (!test) return;

    if (!title.trim()) {
      setError("Test name is required.");
      return;
    }

    if (!exam.trim()) {
      setError("Exam name is required.");
      return;
    }

    if (!className.trim()) {
      setError("Class is required.");
      return;
    }

    if (!subject) {
      setError("Subject is required.");
      return;
    }

    if (duration <= 0) {
      setError("Duration must be greater than 0.");
      return;
    }

    if (totalQuestions <= 0) {
      setError("Number of questions must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatePayload: Record<string, unknown> = {
        title: title.trim(),
        exam: exam.trim(),
        class_name: className.trim(),
        duration_minutes: duration,
        total_marks: totalMarks,
        total_questions: totalQuestions,
        negative_marks: negativeMarks,
        status: "Draft",
        updated_at: new Date().toISOString(),
      };

      if (startTime) {
        updatePayload.start_time = new Date(
          startTime
        ).toISOString();
      } else {
        updatePayload.start_time = null;
      }

      const { data, error: updateError } = await supabase
        .from("tests")
        .update(updatePayload)
        .eq("id", test.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setTest(data);
      setEditTest(false);

      setSuccess("Test details saved successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save test details."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     SELECT EXISTING BANK QUESTION
  ========================================================== */

  function toggleBankQuestion(questionId: number) {
    if (selectedQuestionIds.includes(questionId)) {
      setSelectedQuestionIds((current) =>
        current.filter((id) => id !== questionId)
      );
      return;
    }

    if (
      questions.length +
        selectedQuestionIds.length >=
      totalQuestions
    ) {
      setError(
        `This test allows only ${totalQuestions} questions.`
      );
      return;
    }

    setError("");

    setSelectedQuestionIds((current) => [
      ...current,
      questionId,
    ]);
  }

  /* ==========================================================
     ADD SELECTED BANK QUESTIONS
  ========================================================== */

  function addSelectedBankQuestions() {
    if (selectedQuestionIds.length === 0) {
      setError("Select at least one question.");
      return;
    }

    const selected = bankQuestions.filter((question) =>
      selectedQuestionIds.includes(question.id)
    );

    if (
      questions.length + selected.length >
      totalQuestions
    ) {
      setError(
        `Only ${totalQuestions - questions.length} more question(s) can be added.`
      );
      return;
    }

    setQuestions((current) => [
      ...current,
      ...selected,
    ]);

    setBankQuestions((current) =>
      current.filter(
        (question) =>
          !selectedQuestionIds.includes(question.id)
      )
    );

    setExistingQuestionIds((current) => [
      ...current,
      ...selectedQuestionIds,
    ]);

    setSelectedQuestionIds([]);

    setSuccess(
      `${selected.length} question(s) added to the test.`
    );
  }

  /* ==========================================================
     REMOVE QUESTION FROM TEST
  ========================================================== */

  function removeQuestion(
    questionId: number | string
  ) {
    setQuestions((current) =>
      current.filter(
        (question) =>
          question.id !== questionId &&
          question.tempId !== String(questionId)
      )
    );
  }

  /* ==========================================================
     EDIT QUESTION
  ========================================================== */

  function updateQuestion(
    questionId: number | string,
    field: keyof EditableQuestion,
    value: string | number | null
  ) {
    setQuestions((current) =>
      current.map((question) => {
        const matches =
          question.id === questionId ||
          question.tempId === String(questionId);

        if (!matches) {
          return question;
        }

        return {
          ...question,
          [field]: value,
        };
      })
    );
  }

  /* ==========================================================
     AI GENERATE
  ========================================================== */

  async function generateQuestionsWithAI() {
    if (!subject || !chapter || !topic) {
      setError(
        "Subject, Chapter and Topic are required before generating questions."
      );
      return;
    }

    if (aiQuestionCount <= 0) {
      setError("Enter a valid number of questions.");
      return;
    }

    const remaining =
      totalQuestions - questions.length;

    if (remaining <= 0) {
      setError(
        "The required number of questions is already complete."
      );
      return;
    }

    const count = Math.min(
      aiQuestionCount,
      remaining
    );

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const request = {
        exam: exam || "NEET",

        subject: subject.name,
        subjectDetails:
          subject.description || "",

        chapter: chapter.name,
        chapterDetails:
          chapter.description || "",

        topic: topic.name,
        topicDetails:
          topic.description || "",

        questionType,
        difficulty,

        bloom: "Auto",

        numberOfQuestions: count,

        language: "English",

        includeExplanation: true,
        includeHint: true,
        includeLearningObjective: true,
        includeTags: true,
        avoidDuplicates: true,
      };

      const response = await fetch(
        "/api/ai/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI question generation failed."
        );
      }

      const generated =
        data.valid ||
        data.questions ||
        [];

      if (!Array.isArray(generated) || generated.length === 0) {
        throw new Error(
          "AI did not return valid questions."
        );
      }

      const converted: EditableQuestion[] =
        generated.map(
          (
            question: any,
            index: number
          ) => {
            const options =
              question.options || {};

            return {
              id: -Date.now() - index,

              tempId: `ai-${Date.now()}-${index}`,

              question_text:
                question.question ||
                question.question_text ||
                "",

              question_type:
                questionType || "MCQ",

              difficulty:
                question.difficulty ||
                difficulty,

              marks:
                Number(question.marks) ||
                1,

              negative_marks:
                Number(
                  question.negativeMarks ??
                    question.negative_marks ??
                    negativeMarks
                ),

              option_a:
                options.A ||
                question.option_a ||
                "",

              option_b:
                options.B ||
                question.option_b ||
                "",

              option_c:
                options.C ||
                question.option_c ||
                "",

              option_d:
                options.D ||
                question.option_d ||
                "",

              correct_answer:
                question.correctAnswer ||
                question.correct_answer ||
                "",

              explanation:
                question.explanation ||
                "",

              hint:
                question.hint ||
                "",

              learning_objective:
                question.learningObjective ||
                question.learning_objective ||
                "",

              tags: Array.isArray(question.tags)
                ? question.tags.join(", ")
                : question.tags || "",

              status: "Draft",

              is_active: true,

              source_type: "AI",

              generated_by: "Gemini",

              ai_model:
                "Gemini",

              isNew: true,
            };
          }
        );

      setQuestions((current) => [
        ...current,
        ...converted.slice(
          0,
          remaining
        ),
      ]);

      setSuccess(
        `${Math.min(
          converted.length,
          remaining
        )} AI question(s) generated as Draft. Please review and edit them before saving.`
      );
    } catch (err) {
      console.error(
        "AI GENERATION ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "AI generation failed."
      );
    } finally {
      setGenerating(false);
    }
  }

  /* ==========================================================
     SAVE COMPLETE TEST
  ========================================================== */

  async function saveCompleteTest() {
    if (!test) return;

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Test name is required.");
      return;
    }

    if (!subject || !chapter || !topic) {
      setError(
        "Subject, Chapter and Topic must be selected."
      );
      return;
    }

    if (questions.length !== totalQuestions) {
      setError(
        `Please add exactly ${totalQuestions} questions before saving.`
      );
      return;
    }

    const incomplete = questions.find(
      (question) =>
        !question.question_text.trim() ||
        !question.correct_answer
    );

    if (incomplete) {
      setError(
        "Every question must have question text and a correct answer."
      );
      return;
    }

    try {
      setSaving(true);

      /* --------------------------------------------------------
         1. SAVE TEST DETAILS
      -------------------------------------------------------- */

      const testUpdate: Record<string, unknown> = {
        title: title.trim(),
        exam: exam.trim(),
        class_name: className.trim(),

        subject_id: subject.id,
        chapter_id: chapter.id,
        topic_id: topic.id,

        duration_minutes: duration,
        total_marks: totalMarks,
        total_questions: totalQuestions,
        negative_marks: negativeMarks,

        question_type: questionType,
        difficulty,

        status: "Draft",

        updated_at:
          new Date().toISOString(),
      };

      if (startTime) {
        testUpdate.start_time =
          new Date(startTime).toISOString();
      }

      const { data: savedTest, error: testError } =
        await supabase
          .from("tests")
          .update(testUpdate)
          .eq("id", test.id)
          .select()
          .single();

      if (testError) {
        throw testError;
      }

      /* --------------------------------------------------------
         2. SAVE NEW / AI QUESTIONS
      -------------------------------------------------------- */

      const questionIds: number[] = [];

      for (const question of questions) {
        /*
         * Existing database question
         */
        if (
          question.id > 0 &&
          !question.isNew
        ) {
          const { error: updateQuestionError } =
            await supabase
              .from("questions")
              .update({
                question_text:
                  question.question_text,

                question_type:
                  question.question_type ||
                  "MCQ",

                difficulty:
                  question.difficulty ||
                  "Medium",

                marks:
                  question.marks ?? 0,

                negative_marks:
                  question.negative_marks ?? 0,

                option_a:
                  question.option_a,

                option_b:
                  question.option_b,

                option_c:
                  question.option_c,

                option_d:
                  question.option_d,

                correct_answer:
                  question.correct_answer,

                explanation:
                  question.explanation,

                hint: question.hint,

                learning_objective:
                  question.learning_objective,

                tags: question.tags,

                updated_at:
                  new Date().toISOString(),
              })
              .eq("id", question.id);

          if (updateQuestionError) {
            throw updateQuestionError;
          }

          questionIds.push(question.id);

          continue;
        }

        /* ------------------------------------------------------
           NEW / AI QUESTION
        ------------------------------------------------------ */

        const { data: insertedQuestion, error: insertError } =
          await supabase
            .from("questions")
            .insert({
              subject_id: subject.id,
              chapter_id: chapter.id,
              topic_id: topic.id,

              question_text:
                question.question_text,

              question_type:
                question.question_type ||
                "MCQ",

              difficulty:
                question.difficulty ||
                "Medium",

              marks:
                question.marks ?? 0,

              negative_marks:
                question.negative_marks ?? 0,

              option_a:
                question.option_a,

              option_b:
                question.option_b,

              option_c:
                question.option_c,

              option_d:
                question.option_d,

              correct_answer:
                question.correct_answer,

              explanation:
                question.explanation,

              hint:
                question.hint,

              learning_objective:
                question.learning_objective,

              tags:
                question.tags,

              status: "Draft",

              is_active: true,

              source_type:
                question.source_type ||
                "AI",

              generated_by:
                question.generated_by ||
                "Gemini",

              ai_model:
                question.ai_model ||
                "Gemini",
            })
            .select("id")
            .single();

        if (insertError) {
          throw insertError;
        }

        if (insertedQuestion) {
          questionIds.push(
            insertedQuestion.id
          );
        }
      }

      /* --------------------------------------------------------
         3. REMOVE OLD TEST LINKS
      -------------------------------------------------------- */

      const { error: deleteLinksError } =
        await supabase
          .from("test_questions")
          .delete()
          .eq("test_id", savedTest.id);

      if (deleteLinksError) {
        throw deleteLinksError;
      }

      /* --------------------------------------------------------
         4. CREATE NEW TEST LINKS
      -------------------------------------------------------- */

      const linkRows = questionIds.map(
        (questionId, index) => {
          const question =
            questions[index];

          return {
            test_id: savedTest.id,

            question_id: questionId,

            question_order: index + 1,

            marks:
              question?.marks ?? 0,

            negative_marks:
              question?.negative_marks ?? 0,
          };
        }
      );

      const {
        error: linkError,
      } = await supabase
        .from("test_questions")
        .insert(linkRows);

      if (linkError) {
        throw linkError;
      }

      setTest(savedTest);

      /*
       * Convert new AI questions into normal
       * database questions after save.
       */
      setQuestions((current) =>
        current.map((question, index) => ({
          ...question,
          id:
            questionIds[index] ||
            question.id,
          isNew: false,
        }))
      );

      setExistingQuestionIds(
        questionIds
      );

      setSuccess(
        "Test saved successfully as Draft."
      );

      /*
       * Repository comes later.
       * For now stay on this page.
       */
    } catch (err) {
      console.error(
        "SAVE TEST ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the test."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="text-sm text-slate-500">
            Loading Create Test Workspace...
          </p>
        </div>
      </main>
    );
  }

  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!test) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-4 text-xl font-bold">
            Test Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <Link
            href="/repository"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Repository
          </Link>
        </div>
      </main>
    );
  }

  const progress =
    totalQuestions > 0
      ? Math.min(
          (questions.length /
            totalQuestions) *
            100,
          100
        )
      : 0;

  const computedMarks = questions.reduce(
    (sum, question) =>
      sum + Number(question.marks || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          <div className="flex items-center gap-4">

            <Link
              href="/repository"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Repository
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Create / Edit Test
                </h1>

                <p className="text-xs text-slate-500">
                  Create, generate, review and save your assessment
                </p>
              </div>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
              {test.status || "Draft"}
            </span>

            <button
              type="button"
              onClick={saveCompleteTest}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : "Save Test"}
            </button>

          </div>

        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-8">

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {error && (
          <div className="mb-5 flex items-start justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* ====================================================
            TEST DETAILS
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step 1
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Test Details
              </h2>

              <p className="text-xs text-slate-500">
                Configure the assessment before generating questions.
              </p>
            </div>

            {!editTest ? (
              <button
                type="button"
                onClick={() => setEditTest(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit Details
              </button>
            ) : (
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() => setEditTest(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTestDetails}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  <Check className="h-4 w-4" />
                  Save Details
                </button>

              </div>
            )}

          </div>

          <div className="p-6">

            {!editTest ? (
              <div className="grid gap-4 md:grid-cols-4">

                <InfoCard
                  label="Test Name"
                  value={title}
                />

                <InfoCard
                  label="Exam"
                  value={exam}
                />

                <InfoCard
                  label="Class"
                  value={className}
                />

                <InfoCard
                  label="Subject"
                  value={subject?.name || "—"}
                />

                <InfoCard
                  label="Chapter"
                  value={chapter?.name || "—"}
                />

                <InfoCard
                  label="Topic"
                  value={topic?.name || "—"}
                />

                <InfoCard
                  label="Maximum Marks"
                  value={String(totalMarks)}
                />

                <InfoCard
                  label="Questions"
                  value={String(totalQuestions)}
                />

                <InfoCard
                  label="Duration"
                  value={`${duration} minutes`}
                />

                <InfoCard
                  label="Negative Marks"
                  value={String(negativeMarks)}
                />

                <InfoCard
                  label="Question Type"
                  value={questionType}
                />

                <InfoCard
                  label="Difficulty"
                  value={difficulty}
                />

              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">

                <InputField
                  label="Test Name"
                  value={title}
                  onChange={setTitle}
                />

                <InputField
                  label="Exam"
                  value={exam}
                  onChange={setExam}
                />

                <InputField
                  label="Class"
                  value={className}
                  onChange={setClassName}
                />

                <InputField
                  label="Maximum Marks"
                  type="number"
                  value={String(totalMarks)}
                  onChange={(value) =>
                    setTotalMarks(
                      Number(value)
                    )
                  }
                />

                <InputField
                  label="Number of Questions"
                  type="number"
                  value={String(totalQuestions)}
                  onChange={(value) =>
                    setTotalQuestions(
                      Number(value)
                    )
                  }
                />

                <InputField
                  label="Duration (minutes)"
                  type="number"
                  value={String(duration)}
                  onChange={(value) =>
                    setDuration(
                      Number(value)
                    )
                  }
                />

                <InputField
                  label="Negative Marks"
                  type="number"
                  value={String(negativeMarks)}
                  onChange={(value) =>
                    setNegativeMarks(
                      Number(value)
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Start Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            )}

            {/* ACADEMIC SCOPE */}

            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">

              {subject && (
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  Subject: {subject.name}
                </span>
              )}

              {chapter && (
                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                  Chapter: {chapter.name}
                </span>
              )}

              {topic && (
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  Topic: {topic.name}
                </span>
              )}

            </div>

          </div>

        </section>

        {/* ====================================================
            AI GENERATION
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">

          <div className="border-b border-blue-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 2
                </p>

                <h2 className="text-lg font-bold text-slate-900">
                  AI Question Generation
                </h2>

                <p className="text-xs text-slate-500">
                  Generate questions for the selected academic scope.
                </p>
              </div>

            </div>

          </div>

          <div className="grid gap-4 p-6 md:grid-cols-4">

            <SelectField
              label="Question Type"
              value={questionType}
              options={[
                "MCQ",
                "Assertion & Reason",
                "Case Study",
                "Subjective",
              ]}
              onChange={setQuestionType}
            />

            <SelectField
              label="Difficulty"
              value={difficulty}
              options={[
                "Easy",
                "Medium",
                "Hard",
              ]}
              onChange={setDifficulty}
            />

            <InputField
              label="AI Questions"
              type="number"
              value={String(aiQuestionCount)}
              onChange={(value) =>
                setAiQuestionCount(
                  Number(value)
                )
              }
            />

            <div className="flex items-end">

              <button
                type="button"
                onClick={generateQuestionsWithAI}
                disabled={generating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </button>

            </div>

          </div>

          <div className="px-6 pb-6">

            <div className="rounded-xl border border-blue-100 bg-white/70 px-4 py-3 text-xs text-slate-600">
              <strong>AI questions remain Draft.</strong>{" "}
              Review and edit every generated question before
              clicking <strong>Save Test</strong>.
            </div>

          </div>

        </section>

        {/* ====================================================
            QUESTION REVIEW
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 3
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Question Review & Edit
                </h2>

                <p className="text-xs text-slate-500">
                  Review every question before saving the test.
                </p>
              </div>

              <div className="text-right">

                <p className="text-2xl font-bold text-blue-600">
                  {questions.length}/{totalQuestions}
                </p>

                <p className="text-[11px] text-slate-400">
                  Questions
                </p>

              </div>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <div className="p-6">

            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">

                <FileText className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-4 text-base font-bold text-slate-700">
                  No questions added yet
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  Generate questions with AI or select questions
                  from the repository below.
                </p>

              </div>
            ) : (
              <div className="space-y-5">

                {questions.map(
                  (question, index) => {
                    const isEditing =
                      editingQuestionId ===
                      (question.id ||
                        question.tempId);

                    const isAI =
                      question.isNew ||
                      question.source_type ===
                        "AI";

                    return (
                      <div
                        key={
                          question.tempId ||
                          question.id
                        }
                        className={`rounded-2xl border p-5 ${
                          isAI
                            ? "border-purple-200 bg-purple-50/30"
                            : "border-slate-200"
                        }`}
                      >

                        {/* QUESTION HEADER */}

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex items-center gap-2">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                              Q{index + 1}
                            </span>

                            {isAI && (
                              <span className="flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700">
                                <Sparkles className="h-3 w-3" />
                                AI DRAFT
                              </span>
                            )}

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                              {question.question_type ||
                                "MCQ"}
                            </span>

                            <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                              {question.difficulty ||
                                "Medium"}
                            </span>

                          </div>

                          <div className="flex items-center gap-2">

                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingQuestionId(
                                    question.id ||
                                      question.tempId ||
                                      null
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                            )}

                            {isEditing && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingQuestionId(
                                    null
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Done
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removeQuestion(
                                  question.id ||
                                    question.tempId ||
                                    ""
                                )
                              }
                              className="rounded-lg border border-red-200 bg-white p-2 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                        </div>

                        {/* QUESTION CONTENT */}

                        <div className="mt-5">

                          {isEditing ? (
                            <div className="space-y-4">

                              <TextAreaField
                                label="Question"
                                value={
                                  question.question_text
                                }
                                onChange={(value) =>
                                  updateQuestion(
                                    question.id ||
                                      question.tempId ||
                                      "",
                                    "question_text",
                                    value
                                  )
                                }
                              />

                              <div className="grid gap-4 md:grid-cols-2">

                                <InputField
                                  label="Option A"
                                  value={
                                    question.option_a ||
                                    ""
                                  }
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "option_a",
                                      value
                                    )
                                  }
                                />

                                <InputField
                                  label="Option B"
                                  value={
                                    question.option_b ||
                                    ""
                                  }
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "option_b",
                                      value
                                    )
                                  }
                                />

                                <InputField
                                  label="Option C"
                                  value={
                                    question.option_c ||
                                    ""
                                  }
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "option_c",
                                      value
                                    )
                                  }
                                />

                                <InputField
                                  label="Option D"
                                  value={
                                    question.option_d ||
                                    ""
                                  }
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "option_d",
                                      value
                                    )
                                  }
                                />

                              </div>

                              <div className="grid gap-4 md:grid-cols-4">

                                <SelectField
                                  label="Correct Answer"
                                  value={
                                    question.correct_answer ||
                                    ""
                                  }
                                  options={[
                                    "A",
                                    "B",
                                    "C",
                                    "D",
                                  ]}
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "correct_answer",
                                      value
                                    )
                                  }
                                />

                                <InputField
                                  label="Marks"
                                  type="number"
                                  value={String(
                                    question.marks ??
                                      0
                                  )}
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "marks",
                                      Number(value)
                                    )
                                  }
                                />

                                <InputField
                                  label="Negative Marks"
                                  type="number"
                                  value={String(
                                    question.negative_marks ??
                                      0
                                  )}
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "negative_marks",
                                      Number(value)
                                    )
                                  }
                                />

                                <SelectField
                                  label="Difficulty"
                                  value={
                                    question.difficulty ||
                                    "Medium"
                                  }
                                  options={[
                                    "Easy",
                                    "Medium",
                                    "Hard",
                                  ]}
                                  onChange={(value) =>
                                    updateQuestion(
                                      question.id ||
                                        question.tempId ||
                                        "",
                                      "difficulty",
                                      value
                                    )
                                  }
                                />

                              </div>

                              <TextAreaField
                                label="Explanation"
                                value={
                                  question.explanation ||
                                  ""
                                }
                                onChange={(value) =>
                                  updateQuestion(
                                    question.id ||
                                      question.tempId ||
                                      "",
                                    "explanation",
                                    value
                                  )
                                }
                              />

                              <TextAreaField
                                label="Learning Objective"
                                value={
                                  question.learning_objective ||
                                  ""
                                }
                                onChange={(value) =>
                                  updateQuestion(
                                    question.id ||
                                      question.tempId ||
                                      "",
                                    "learning_objective",
                                    value
                                  )
                                }
                              />

                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-medium leading-7 text-slate-800">
                                {question.question_text}
                              </p>

                              <div className="mt-4 grid gap-2 md:grid-cols-2">

                                {[
                                  [
                                    "A",
                                    question.option_a,
                                  ],
                                  [
                                    "B",
                                    question.option_b,
                                  ],
                                  [
                                    "C",
                                    question.option_c,
                                  ],
                                  [
                                    "D",
                                    question.option_d,
                                  ],
                                ].map(
                                  ([letter, value]) => (
                                    <div
                                      key={letter}
                                      className={`rounded-xl border px-4 py-3 text-xs ${
                                        question.correct_answer ===
                                        letter
                                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                          : "border-slate-100 bg-white text-slate-600"
                                      }`}
                                    >
                                      <span className="mr-2 font-bold">
                                        {letter}.
                                      </span>

                                      {value ||
                                        "—"}
                                    </div>
                                  )
                                )}

                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">

                                <span className="rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700">
                                  Marks:{" "}
                                  {question.marks ??
                                    0}
                                </span>

                                <span className="rounded-lg bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">
                                  Negative:{" "}
                                  {question.negative_marks ??
                                    0}
                                </span>

                                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                                  Answer:{" "}
                                  {question.correct_answer ||
                                    "—"}
                                </span>

                              </div>

                            </>
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            QUESTION BANK
        ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 4
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Question Repository
                </h2>

                <p className="text-xs text-slate-500">
                  Add existing questions to this assessment.
                </p>

              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                {filteredBankQuestions.length} Available
              </span>

            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search repository questions..."
                  className="w-full rounded-xl border border-slate-300 px-10 py-3 text-sm outline-none focus:border-blue-500"
                />

              </div>

              <select
                value={bankDifficulty}
                onChange={(e) =>
                  setBankDifficulty(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              >
                <option value="All">
                  All Difficulties
                </option>

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>

              <button
                type="button"
                onClick={addSelectedBankQuestions}
                disabled={
                  selectedQuestionIds.length ===
                  0
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add Selected
              </button>

            </div>

          </div>

          <div className="p-6">

            {filteredBankQuestions.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                No additional repository questions available.
              </div>
            ) : (
              <div className="space-y-3">

                {filteredBankQuestions.map(
                  (question) => {

                    const selected =
                      selectedQuestionIds.includes(
                        question.id
                      );

                    return (
                      <button
                        type="button"
                        key={question.id}
                        onClick={() =>
                          toggleBankQuestion(
                            question.id
                          )
                        }
                        className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-blue-300"
                        }`}
                      >

                        <div
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="mb-2 flex flex-wrap gap-2">

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                              {question.question_type ||
                                "MCQ"}
                            </span>

                            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                              {question.difficulty ||
                                "Medium"}
                            </span>

                            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                              {question.marks ??
                                0}{" "}
                              marks
                            </span>

                          </div>

                          <p className="text-sm font-medium leading-6 text-slate-700">
                            {question.question_text}
                          </p>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            FINAL SUMMARY
        ==================================================== */}

        <section className="rounded-2xl border border-blue-200 bg-white shadow-sm">

          <div className="p-6">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 5
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Review & Save Test
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review the assessment before saving it as a Draft.
                </p>

              </div>

              <div className="grid grid-cols-3 gap-3">

                <SummaryCard
                  label="Questions"
                  value={`${questions.length}/${totalQuestions}`}
                />

                <SummaryCard
                  label="Marks"
                  value={String(computedMarks)}
                />

                <SummaryCard
                  label="Duration"
                  value={`${duration}m`}
                />

              </div>

            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">

              <CheckItem
                ok={Boolean(title.trim())}
                text="Test details"
              />

              <CheckItem
                ok={Boolean(subject && chapter && topic)}
                text="Academic scope"
              />

              <CheckItem
                ok={
                  questions.length ===
                  totalQuestions
                }
                text="Question count"
              />

              <CheckItem
                ok={
                  questions.length > 0 &&
                  questions.every(
                    (q) =>
                      q.question_text.trim() &&
                      q.correct_answer
                  )
                }
                text="Questions reviewed"
              />

            </div>

            <div className="mt-6 flex justify-end">

              <button
                type="button"
                onClick={saveCompleteTest}
                disabled={
                  saving ||
                  questions.length !==
                    totalQuestions
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Test...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Test as Draft
                  </>
                )}
              </button>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

/* ============================================================
   SMALL UI COMPONENTS
============================================================ */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={4}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[100px] rounded-xl bg-slate-50 px-4 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function CheckItem({
  ok,
  text,
}: {
  ok: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
        ok
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-50 text-slate-400"
      }`}
    >
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}