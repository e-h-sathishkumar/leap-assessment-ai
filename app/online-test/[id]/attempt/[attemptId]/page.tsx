import AttemptWorkspace from "@/components/online-test/AttemptWorkspace";
import { getAttemptById } from "@/services/test.service";

interface Props {
  params: Promise<{
    id: string;
    attemptId: string;
  }>;
}

export default async function AttemptPage({
  params,
}: Props) {
  const { attemptId } = await params;

const attempt = await getAttemptById(
  attemptId
);

console.log("Attempt:", attempt);

  return (
    <AttemptWorkspace
      attempt={attempt}
    />
  );
}