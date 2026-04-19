import { redirect } from "next/navigation";
import { ModeSelector } from "@/components/mode-selector";

type SearchParams = Promise<{ userId?: string; ageGroup?: string }>;

export default async function ModePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { userId, ageGroup } = params;
  if (!userId || !ageGroup) redirect("/");
  return <ModeSelector userId={userId} ageGroup={ageGroup} />;
}
