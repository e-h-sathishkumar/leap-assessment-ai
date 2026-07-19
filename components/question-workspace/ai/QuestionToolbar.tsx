"use client";

import { Button } from "@/components/ui/button";

interface QuestionToolbarProps {
  total: number;
  selected: number;

  mode?: "repository" | "assessment";

  onSelectAll: () => void;
  onClearSelection: () => void;

  onSave?: () => void;
  onAddToTest?: () => void;
}

export default function QuestionToolbar({
  total,
  selected,
  mode = "repository",
  onSelectAll,
  onClearSelection,
  onSave,
  onAddToTest,
}: QuestionToolbarProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      {/* Top Row */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            onClick={onSelectAll}
          >
            ✓ Select All
          </Button>

          <Button
            variant="outline"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>

        </div>

        <div className="text-sm font-medium text-slate-600">
          Selected {selected} of {total}
        </div>

      </div>

      {/* Bottom Row */}

      <div className="mt-5 flex items-center justify-between border-t pt-5">

        <div className="flex gap-3">

          <Button
            variant="outline"
          >
            Export PDF
          </Button>

          <Button
            variant="outline"
          >
            Export CSV
          </Button>

        </div>

        <div className="flex gap-3">

          {mode === "repository" && (
            <Button
              onClick={onSave}
            >
              Save to Repository
            </Button>
          )}

          {mode === "assessment" && (
            <Button
              onClick={onAddToTest}
            >
              Create Test
            </Button>
          )}

        </div>

      </div>

    </div>
  );
}