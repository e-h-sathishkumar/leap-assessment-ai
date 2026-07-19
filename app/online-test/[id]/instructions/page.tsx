import { getPublishedTestById } from "@/services/test.service";
import TestInstructions from "@/components/online-test/TestInstructions";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function InstructionsPage({
  params,
}: Props) {
  const { id } = await params;

  const test = await getPublishedTestById(id);

  return <TestInstructions test={test} />;
}