"use client";

import { useRouter } from "next/navigation";

interface Props {
  test: any;
}

export default function TestInstructions({
  test,
}: Props) {
  const router = useRouter();

  async function handleStart() {
  try {
    const studentId = "d30716e7-0c71-44c0-9317-f16849d0f11c"; // replace with auth later

    const response = await fetch(
      "/api/test-attempts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: test.id,
          studentId,
        }),
      }
    );

    const attempt = await response.json();

    if (!response.ok) {
      throw new Error(
        attempt.error ??
          "Unable to start test."
      );
    }

    router.push(
      `/online-test/${test.id}/attempt/${attempt.id}`
    );

  } catch (err) {
    console.error(err);
    alert("Unable to start test.");
  }
}

  return (
    <div className="mx-auto max-w-5xl rounded-xl border bg-white p-8 shadow">

      <h1 className="text-3xl font-bold">
        {test.title}
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <div>
          <strong>Subject</strong>
          <p>{test.subjects?.name}</p>
        </div>

        <div>
          <strong>Exam</strong>
          <p>{test.exam_type}</p>
        </div>

        <div>
          <strong>Duration</strong>
          <p>{test.duration} Minutes</p>
        </div>

        <div>
          <strong>Total Questions</strong>
          <p>
            {test.total_questions}
          </p>
        </div>

        <div>
          <strong>Total Marks</strong>
          <p>
            {test.maximum_marks}
          </p>
        </div>

        <div>
          <strong>Negative Marking</strong>
          <p>
            {test.negative_marking
              ? "Yes"
              : "No"}
          </p>
        </div>

      </div>

      <div className="mt-10 rounded-lg bg-blue-50 p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Instructions
        </h2>

        <ul className="list-disc space-y-2 pl-5">

          <li>
            Read every question carefully.
          </li>

          <li>
            Do not refresh the browser.
          </li>

          <li>
            Your answers are auto-saved.
          </li>

          <li>
            Timer starts immediately after
            clicking Start Test.
          </li>

          <li>
            Submit before the timer ends.
          </li>

        </ul>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          onClick={handleStart}
          className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
        >
          Start Test
        </button>

      </div>

    </div>
  );
}