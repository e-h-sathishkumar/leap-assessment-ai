import { supabase } from "@/lib/supabase";

interface SubjectSelection {
  subjectId: number;
  subjectName: string;

  chapters: {
    chapterId: number;
    chapterName: string;
    topics: {
      topicId: number;
      topicName: string;
    }[];
  }[];
}

interface AssessmentConfiguration {
  exam: string;
  className: string;
  testTitle: string;

  subjects: SubjectSelection[];

  questionTypes: string[];
  difficulty: string;

  totalQuestions: number;
  durationMinutes: number;

  additionalInstructions?: string;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  learningObjective?: string;
  tags?: string[];
  difficulty?: string;
  bloomLevel?: string;
  marks?: number;
  negativeMarks?: number;
  questionType?: string;
  status: string;
  subjectName?: string;
  chapterName?: string;
  topicName?: string;
}
interface SaveGeneratedAssessmentInput {
  configuration: AssessmentConfiguration;
  questions: GeneratedQuestion[];
}

export async function saveGeneratedAssessment({
  configuration,
  questions,
}: SaveGeneratedAssessmentInput) {
  console.log(
    "================================================"
  );

  console.log(
    "       LEAP ASSESSMENT DATABASE SAVE"
  );

  console.log(
    "================================================"
  );

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const {
    data: {
      user,
    },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  /*
   * During development the teacher may not yet be
   * authenticated through Supabase Auth.
   *
   * Therefore we do not block the database save here.
   */
  const createdBy =
    user?.id ?? null;

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!configuration) {
    throw new Error(
      "Assessment configuration is missing."
    );
  }

  if (
    !questions ||
    questions.length === 0
  ) {
    throw new Error(
      "No questions available to save."
    );
  }

  if (
    questions.length !==
    configuration.totalQuestions
  ) {
    throw new Error(
      `Expected ${configuration.totalQuestions} questions but received ${questions.length}.`
    );
  }

  const unapproved =
    questions.filter(
      (question) =>
        question.status !==
        "Approved"
    );

  if (
    unapproved.length > 0
  ) {
    throw new Error(
      `Please approve all ${unapproved.length} question(s) before saving.`
    );
  }

  if (
    !configuration.subjects ||
    configuration.subjects.length === 0
  ) {
    throw new Error(
      "At least one subject is required."
    );
  }

  // ==========================================================
  // SUBJECT
  // ==========================================================

  const subjectIds =
    configuration.subjects.map(
      (subject) =>
        subject.subjectId
    );

  const uniqueSubjectIds =
    Array.from(
      new Set(subjectIds)
    );

  /*
   * tests currently has one subject_id.
   *
   * If multiple subjects are used,
   * subject_id remains null.
   *
   * Individual questions retain their
   * own subject_id.
   */

  const testSubjectId =
    uniqueSubjectIds.length === 1
      ? uniqueSubjectIds[0]
      : null;

  // ==========================================================
  // CHAPTER
  // ==========================================================

  const chapterIds =
    configuration.subjects.flatMap(
      (subject) =>
        subject.chapters.map(
          (chapter) =>
            chapter.chapterId
        )
    );

  const uniqueChapterIds =
    Array.from(
      new Set(chapterIds)
    );

  const testChapterId =
    uniqueChapterIds.length === 1
      ? uniqueChapterIds[0]
      : null;

  // ==========================================================
  // TOPIC
  // ==========================================================

  const topicIds =
    configuration.subjects.flatMap(
      (subject) =>
        subject.chapters.flatMap(
          (chapter) =>
            chapter.topics.map(
              (topic) =>
                topic.topicId
            )
        )
    );

  const uniqueTopicIds =
    Array.from(
      new Set(topicIds)
    );

  const testTopicId =
    uniqueTopicIds.length === 1
      ? uniqueTopicIds[0]
      : null;

  // ==========================================================
  // QUESTION PAYLOAD
  // ==========================================================

  const questionPayload =
    questions.map(
      (question) => {

        /*
         * Find subject.
         */

        const subject =
          configuration.subjects.find(
            (item) =>
              item.subjectName
                .trim()
                .toLowerCase() ===
              (
                question.subjectName ??
                ""
              )
                .trim()
                .toLowerCase()
          ) ??
          (
            configuration.subjects.length ===
            1
              ? configuration.subjects[0]
              : null
          );

        const subjectId =
          subject?.subjectId ??
          testSubjectId ??
          null;

        // ------------------------------------------------------
        // CHAPTER
        // ------------------------------------------------------

        let chapterId:
          number | null =
          null;

        if (
          subject &&
          question.chapterName &&
          question.chapterName !==
            "AI Selected"
        ) {
          const chapter =
            subject.chapters.find(
              (item) =>
                item.chapterName
                  .trim()
                  .toLowerCase() ===
                question.chapterName!
                  .trim()
                  .toLowerCase()
            );

          if (chapter) {
            chapterId =
              chapter.chapterId;
          }
        }

        /*
         * If exactly one chapter was selected,
         * safely use it.
         */

        if (
          chapterId === null &&
          subject &&
          subject.chapters.length === 1
        ) {
          chapterId =
            subject.chapters[0]
              .chapterId;
        }

        // ------------------------------------------------------
        // TOPIC
        // ------------------------------------------------------

        let topicId:
          number | null =
          null;

        if (
          subject &&
          chapterId !== null &&
          question.topicName &&
          question.topicName !==
            "AI Selected"
        ) {
          const chapter =
            subject.chapters.find(
              (item) =>
                item.chapterId ===
                chapterId
            );

          const topic =
            chapter?.topics.find(
              (item) =>
                item.topicName
                  .trim()
                  .toLowerCase() ===
                question.topicName!
                  .trim()
                  .toLowerCase()
            );

          if (topic) {
            topicId =
              topic.topicId;
          }
        }

        /*
         * If exactly one topic exists
         * under the selected chapter,
         * safely use it.
         */

        if (
          topicId === null &&
          subject &&
          chapterId !== null
        ) {
          const chapter =
            subject.chapters.find(
              (item) =>
                item.chapterId ===
                chapterId
            );

          const topics =
            chapter?.topics ??
            [];

          if (
            topics.length === 1
          ) {
            topicId =
              topics[0].topicId;
          }
        }

        // ------------------------------------------------------
        // OPTIONS
        // ------------------------------------------------------

        const options =
          Array.isArray(
            question.options
          )
            ? question.options
            : [];

        // ------------------------------------------------------
        // RETURN QUESTION ROW
        // ------------------------------------------------------

        return {
          subject_id:
            subjectId,

          chapter_id:
            chapterId,

          topic_id:
            topicId,

          question_text:
            question.question,

          question_type:
            question.questionType ??
            "MCQ",

          difficulty:
  question.difficulty ??
  configuration.difficulty ??
  "Medium",

bloom_level:
  question.bloomLevel ??
  null,

marks:
  Number(
    question.marks ??
    4
  ),

          negative_marks:
            Number(
              question.negativeMarks ??
                1
            ),

          option_a:
            options[0] ??
            "",

          option_b:
            options[1] ??
            "",

          option_c:
            options[2] ??
            "",

          option_d:
            options[3] ??
            "",

          correct_answer:
            question.correctAnswer,

          explanation:
            question.explanation ??
            "",

          hint:
            question.hint ??
            null,

          learning_objective:
            question.learningObjective ??
            null,

          tags:
            question.tags ??
            [],

          status:
            "Approved",

          source_type:
            "AI",

          ai_model:
            "Gemini",

          is_active:
            true,
        };
      }
    );

  console.log(
    "========== QUESTION PAYLOAD =========="
  );

  console.log(
    questionPayload
  );

  // ==========================================================
  // SAVE QUESTIONS
  // ==========================================================

  const {
    data: savedQuestions,
    error: questionError,
  } =
    await supabase
      .from("questions")
      .insert(
        questionPayload
      )
      .select();

  if (questionError) {
    console.error(
      "QUESTION INSERT ERROR",
      questionError
    );

    throw new Error(
      `Unable to save questions: ${questionError.message}`
    );
  }

  if (
    !savedQuestions ||
    savedQuestions.length !==
      questions.length
  ) {
    throw new Error(
      "Question save was incomplete."
    );
  }

  console.log(
    `Saved ${savedQuestions.length} questions.`
  );

  // ==========================================================
  // TOTAL MARKS
  // ==========================================================

  const totalMarks =
    questions.reduce(
      (
        total,
        question
      ) =>
        total +
        Number(
          question.marks ??
            0
        ),
      0
    );

  // ==========================================================
  // CREATE TEST
  // ==========================================================

  const testPayload = {
    exam:
      configuration.exam,

    title:
      configuration.testTitle,

    class_name:
      configuration.className,

    subject_id:
      testSubjectId,

    chapter_id:
      testChapterId,

    topic_id:
      testTopicId,

    total_marks:
      totalMarks,

    duration_minutes:
      configuration.durationMinutes,

    total_questions:
      questions.length,

    status:
      "Draft",

    is_active:
      true,

    created_by:
      createdBy,
  };

  console.log(
    "========== TEST PAYLOAD =========="
  );

  console.log(
    testPayload
  );

  const {
    data: test,
    error: testError,
  } =
    await supabase
      .from("tests")
      .insert(
        testPayload
      )
      .select()
      .single();

  if (testError) {
    console.error(
      "TEST INSERT ERROR",
      testError
    );

    /*
     * Roll back questions.
     */

    const questionIds =
      savedQuestions.map(
        (question) =>
          question.id
      );

    if (
      questionIds.length > 0
    ) {
      await supabase
        .from("questions")
        .delete()
        .in(
          "id",
          questionIds
        );
    }

    throw new Error(
      `Unable to create test: ${testError.message}`
    );
  }

  if (!test) {
    throw new Error(
      "Test was not created."
    );
  }

  console.log(
    "Created test:",
    test.id
  );

  // ==========================================================
  // CREATE TEST QUESTIONS
  // ==========================================================

  const testQuestionPayload =
    savedQuestions.map(
      (
        question,
        index
      ) => ({
        test_id:
          test.id,

        question_id:
          question.id,

        question_order:
          index + 1,

        marks:
          question.marks ??
          0,

        negative_marks:
          question.negative_marks ??
          0,
      })
    );

  console.log(
    "========== TEST QUESTIONS =========="
  );

  console.log(
    testQuestionPayload
  );

  const {
    data: savedTestQuestions,
    error:
      testQuestionError,
  } =
    await supabase
      .from("test_questions")
      .insert(
        testQuestionPayload
      )
      .select();

  if (
    testQuestionError
  ) {
    console.error(
      "TEST QUESTIONS INSERT ERROR",
      testQuestionError
    );

    /*
     * Roll back test.
     */

    await supabase
      .from("tests")
      .delete()
      .eq(
        "id",
        test.id
      );

    /*
     * Roll back questions.
     */

    const questionIds =
      savedQuestions.map(
        (question) =>
          question.id
      );

    if (
      questionIds.length > 0
    ) {
      await supabase
        .from("questions")
        .delete()
        .in(
          "id",
          questionIds
        );
    }

    throw new Error(
      `Unable to link questions to test: ${testQuestionError.message}`
    );
  }

  // ==========================================================
  // SUCCESS
  // ==========================================================

  console.log(
    "================================================"
  );

  console.log(
    "       ASSESSMENT SAVED SUCCESSFULLY"
  );

  console.log(
    "================================================"
  );

  return {
    test,

    questions:
      savedQuestions,

    testQuestions:
      savedTestQuestions ??
      [],
  };
}