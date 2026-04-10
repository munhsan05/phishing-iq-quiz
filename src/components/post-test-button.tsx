"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AgeGroup } from "@/lib/constants";

type PostTestButtonProps = {
  experimentId: string;
  name: string;
  ageGroup: AgeGroup;
};

/**
 * Stores the experiment state in localStorage and navigates to the
 * home page, where the post-test flow is auto-detected.
 */
export function PostTestButton({
  experimentId,
  name,
  ageGroup,
}: PostTestButtonProps) {
  const router = useRouter();

  function handleClick() {
    localStorage.setItem(
      "phishing-quiz-experiment",
      JSON.stringify({ experimentId, ageGroup, name }),
    );
    router.push("/");
  }

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleClick}
      className="h-12 flex-1 bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]"
    >
      Post-test өгөх →
    </Button>
  );
}
