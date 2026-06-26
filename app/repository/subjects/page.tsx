import AddSubjectDialog from "@/components/subjects/AddSubjectDialog";
import SubjectTable from "@/components/subjects/SubjectTable";
import { getSubjects } from "@/services/subject.service";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Subject Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all NEET/JEE subjects
          </p>
        </div>

        <AddSubjectDialog />
      </div>

      {/* Subject Table */}
      <SubjectTable subjects={subjects} />
    </div>
  );
}