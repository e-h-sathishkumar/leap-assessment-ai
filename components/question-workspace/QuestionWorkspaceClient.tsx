"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import QuestionWizard from "./wizard/QuestionWizard";
import QuestionTable from "./QuestionTable";
import QuestionSearch from "./QuestionSearch";
import QuestionStats from "./QuestionStats";

import type { QuestionBank } from "@/types/question-bank";

interface Props {
  questions: QuestionBank[];
}

export default function QuestionWorkspaceClient({
  questions,
}: Props) {
  const [openWizard, setOpenWizard] =
    useState(false);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Question Workspace
          </h1>

          <p className="text-slate-500">
            Create, manage and review questions.
          </p>

        </div>

        <Button
          onClick={() =>
            setOpenWizard(true)
          }
        >
          + New Question
        </Button>

      </div>

      <QuestionStats
        questions={questions}
      />

      <QuestionSearch />

      <QuestionTable
        questions={questions}
      />

      {openWizard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40">

          <div className="mx-auto mt-10 w-[95%] max-w-7xl rounded-xl bg-white p-8">

            <div className="mb-6 flex justify-between">

              <h2 className="text-2xl font-bold">
                New Question
              </h2>

              <Button
                variant="outline"
                onClick={() =>
                  setOpenWizard(false)
                }
              >
                Close
              </Button>

            </div>

            <QuestionWizard />

          </div>

        </div>
      )}

    </div>
  );
}