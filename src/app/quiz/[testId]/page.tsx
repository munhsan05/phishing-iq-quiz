"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QuizRunner } from "@/components/quiz-runner";
import type { AgeGroup } from "@/lib/constants";
import { AGE_GROUPS } from "@/lib/constants";
import type { ClientQuestion } from "@/lib/types";

type StoredQuiz = {
  testId: string;
  ageGroup: AgeGroup;
  name: string;
  questions: ClientQuestion[];
};

type PageProps = {
  params: Promise<{ testId: string }>;
};

/**
 * Hydrates the quiz runner from sessionStorage.
 *
 * The home page writes the quiz payload under `quiz-{testId}` after calling
 * the `startQuiz` server action. We read it here on mount, validate it,
 * then hand off to `<QuizRunner />`.
 *
 * If the payload is missing or malformed (e.g. user reloaded or shared the
 * URL) we show a toast and bounce back home.
 */
export default function QuizPage({ params }: PageProps) {
  // Next.js 16: `params` is async — unwrap with React `use()`.
  const { testId } = use(params);
  const router = useRouter();
  const [payload, setPayload] = useState<StoredQuiz | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(`quiz-${testId}`);
      if (!raw) {
        setState("missing");
        return;
      }
      const parsed = JSON.parse(raw) as StoredQuiz;
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        parsed.testId !== testId ||
        !(AGE_GROUPS as readonly string[]).includes(parsed.ageGroup) ||
        !Array.isArray(parsed.questions) ||
        parsed.questions.length === 0
      ) {
        setState("missing");
        return;
      }
      setPayload(parsed);
      setState("ready");
    } catch (err) {
      console.error("Failed to hydrate quiz from sessionStorage", err);
      setState("missing");
    }
  }, [testId]);

  useEffect(() => {
    if (state === "missing") {
      toast.error("Тестийн мэдээлэл олдсонгүй. Эхнээс нь эхлүүлнэ үү.");
      router.replace("/");
    }
  }, [state, router]);

  if (state === "loading") {
    return (
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="text-sm text-muted-foreground">
          Тестийг ачаалж байна...
        </div>
      </main>
    );
  }

  if (state === "missing" || !payload) {
    return (
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="text-sm text-muted-foreground">
          Тестийн мэдээлэл алга. Эхлэлрүү буцах...
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <QuizRunner
        testId={payload.testId}
        questions={payload.questions}
        ageGroup={payload.ageGroup}
      />
    </main>
  );
}
