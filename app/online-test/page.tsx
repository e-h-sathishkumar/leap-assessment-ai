import { getPublishedTests } from "@/services/test.service";
import PublishedTests from "@/components/online-test/PublishedTests";

export default async function OnlineTestsPage() {
  const tests = await getPublishedTests();

  return <PublishedTests tests={tests} />;
}