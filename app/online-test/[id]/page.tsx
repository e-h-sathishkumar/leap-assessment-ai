import { redirect } from "next/navigation";

interface OnlineTestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OnlineTestPage({
  params,
}: OnlineTestPageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/student/dashboard");
  }

  redirect(`/online-test/${id}/instructions`);
}