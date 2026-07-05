"use client";

import { Button } from "@/components/ui/button";

interface QuestionToolbarProps {
  total: number;
  selected: number;

  mode?: "repository" | "assessment";

  loading?: boolean;

  onSelectAll: () => void;
  onClearSelection: () => void;

  onSave?: () => void;
  onAddToTest?: () => void;

  onRegenerate?: () => void;
  onExport?: () => void;
}

export default function QuestionToolbar({
  total,
  selected,
  mode = "repository",
  loading = false,
  onSelectAll,
  onClearSelection,
  onSave,
  onAddToTest,
  onRegenerate,
  onExport,
}: QuestionToolbarProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            AI Question Workspace
          </h2>

          <p className="mt-1 text-slate-500">
            {total} Questions • {selected} Selected
          </p>

        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={onSelectAll}
          >
            Select All
          </Button>

          <Button
            variant="outline"
            onClick={onClearSelection}
          >
            Clear
          </Button>

          <Button
            variant="outline"
            onClick={onRegenerate}
          >
            Regenerate
          </Button>

          <Button
            variant="outline"
            onClick={onExport}
          >
            Export
          </Button>

          {mode === "repository" && (
            <Button
              onClick={onSave}
              disabled={selected === 0 || loading}
            >
              {loading
                ? "Saving..."
                : "Save to Repository"}
            </Button>
          )}

          {mode === "assessment" && (
            <Button
              onClick={onAddToTest}
              disabled={selected === 0 || loading}
            >
              {loading
                ? "Adding..."
                : "Add Selected to Test"}
            </Button>
          )}

        </div>

      </div>

    </div>
  );
}