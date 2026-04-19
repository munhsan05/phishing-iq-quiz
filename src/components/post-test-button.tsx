"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { startQuiz } from "@/app/actions/quiz";
import { getOrCreateUserId } from "@/lib/user-id";
import type { AgeGroup } from "@/lib/constants";
import type { ClientQuestion } from "@/lib/types";

type StoredQuiz = {
  testId: string;
  ageGroup: AgeGroup;
  questions: ClientQuestion[];
};

export function PostTestButton({
  experimentId,
  ageGroup,
}: {
  experimentId: string;
  ageGroup: AgeGroup;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const userId = getOrCreateUserId();
        const { testId, questions } = await startQuiz({
          userId,
          ageGroup,
          experimentId,
        });
        const payload: StoredQuiz = { testId, ageGroup, questions };
        window.sessionStorage.setItem(
          `quiz-${testId}`,
          JSON.stringify(payload),
        );
        window.localStorage.removeItem("phishing-quiz-experiment");
        router.push(`/quiz/${testId}`);
      } catch (err) {
        console.error("Post-test start failed:", err);
        const message =
          err instanceof Error ? err.message : "Post-test эхлүүлэхэд алдаа";
        toast.error(`Алдаа: ${message}`);
      }
    });
  }

  return (
    <Button
      type="button"
      size="lg"
      disabled={isPending}
      onClick={handleClick}
      className="h-12 flex-1 bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]"
    >
      {isPending ? "Бэлтгэж байна..." : "Post-test эхлүүлэх →"}
    </Button>
  );
}
