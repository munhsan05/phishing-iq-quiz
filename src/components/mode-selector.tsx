"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MODE_LABELS,
  MODE_DESCRIPTIONS,
  TYPE_LABELS,
  TYPE_ICONS,
} from "@/lib/constants";
import type { QuestionType, QuizMode } from "@/lib/types";

export function ModeSelector({ userId, ageGroup }: { userId: string; ageGroup: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<QuizMode | null>(null);

  function start(mode: QuizMode, category?: QuestionType) {
    setPending(mode);
    const qs = new URLSearchParams({
      mode,
      userId,
      ageGroup,
      ...(category && { category }),
    });
    router.push(`/quiz/start?${qs.toString()}`);
  }

  const modes: { id: QuizMode; emoji: string }[] = [
    { id: "leveled", emoji: "🎓" },
    { id: "mixed", emoji: "⚡" },
    { id: "category", emoji: "🎯" },
  ];

  const types: QuestionType[] = ["email", "sms", "qr", "browser", "inbox_batch"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Тестийн горим сонгох</h1>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              if (m.id === "category") return;
              start(m.id);
            }}
            disabled={pending !== null}
            className="rounded-lg border border-border bg-card p-6 text-left transition hover:border-primary hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <div className="text-4xl mb-2">{m.emoji}</div>
            <div className="font-semibold text-lg">{MODE_LABELS[m.id]}</div>
            <p className="text-sm text-muted-foreground mt-2">{MODE_DESCRIPTIONS[m.id]}</p>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card/50 p-4">
        <h2 className="font-semibold mb-3">Төрлөөр сонгох:</h2>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => start("category", t)}
              disabled={pending !== null}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1",
              )}
            >
              <span>{TYPE_ICONS[t]}</span>
              <span>{TYPE_LABELS[t]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
