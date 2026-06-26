"use client";

import { createSubjectAction } from "@/app/repository/subjects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubjectForm() {
  return (
    <form action={createSubjectAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Subject Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Physics"
          required
        />
      </div>

      <div>
        <Label htmlFor="code">Subject Code</Label>
        <Input
          id="code"
          name="code"
          placeholder="PHY"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional description"
        />
      </div>

      <Button type="submit" className="w-full">
        Save Subject
      </Button>
    </form>
  );
}