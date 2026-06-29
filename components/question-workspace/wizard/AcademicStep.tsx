"use client";

import { useMemo } from "react";

import EntitySelect from "@/components/common/EntitySelect";
import { useQuestion } from "../hooks/useQuestion";

import type { Subject } from "@/types/subject";
import type { Chapter } from "@/types/chapter";
import type { Topic } from "@/types/topic";

interface Lookup {
  id: number;
  name: string;
}

interface AcademicStepProps {
  subjects?: Subject[];
  chapters?: Chapter[];
  topics?: Topic[];
  difficultyLevels?: Lookup[];
  bloomLevels?: Lookup[];
  questionTypes?: Lookup[];
}

export default function AcademicStep({
  subjects = [],
  chapters = [],
  topics = [],
  difficultyLevels = [],
  bloomLevels = [],
  questionTypes = [],
}: AcademicStepProps) {

  const {
    question,
    updateQuestion,
  } = useQuestion();

  const filteredChapters = useMemo(() => {

    if (!question.subject_id) return [];

    return chapters.filter(
      (chapter) =>
        chapter.subject_id === question.subject_id
    );

  }, [chapters, question.subject_id]);

  const filteredTopics = useMemo(() => {

    if (!question.chapter_id) return [];

    return topics.filter(
      (topic) =>
        topic.chapter_id === question.chapter_id
    );

  }, [topics, question.chapter_id]);

  return (

    <div className="space-y-8">

      <div>

        <h2 className="text-2xl font-semibold">
          Academic Information
        </h2>

        <p className="text-slate-500 mt-1">
          Select the academic hierarchy for this
          question.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <EntitySelect
          label="Subject"
          placeholder="Select Subject"
          value={String(question.subject_id ?? "")}
          options={subjects}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              subject_id: Number(value),

              chapter_id: undefined,

              topic_id: undefined,

            })

          }
        />

        <EntitySelect
          label="Chapter"
          placeholder="Select Chapter"
          value={String(question.chapter_id ?? "")}
          options={filteredChapters}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              chapter_id: Number(value),

              topic_id: undefined,

            })

          }
        />

        <EntitySelect
          label="Topic"
          placeholder="Select Topic"
          value={String(question.topic_id ?? "")}
          options={filteredTopics}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              topic_id: Number(value),

            })

          }
        />

        <EntitySelect
          label="Difficulty"
          placeholder="Select Difficulty"
          value={String(question.difficulty_level_id ?? "")}
          options={difficultyLevels}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              difficulty_level_id: Number(value),

            })

          }
        />

        <EntitySelect
          label="Bloom Level"
          placeholder="Select Bloom Level"
          value={String(question.bloom_level_id ?? "")}
          options={bloomLevels}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              bloom_level_id: Number(value),

            })

          }
        />

        <EntitySelect
          label="Question Type"
          placeholder="Select Question Type"
          value={String(question.question_type_id ?? "")}
          options={questionTypes}
          optionLabel="name"
          optionValue="id"
          onChange={(value) =>

            updateQuestion({

              question_type_id: Number(value),

            })

          }
        />

      </div>

    </div>

  );

}