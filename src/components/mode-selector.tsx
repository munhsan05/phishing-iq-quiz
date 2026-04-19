"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  MODE_LABELS,
  MODE_DESCRIPTIONS,
  TYPE_LABELS,
  TYPE_ICONS,
} from "@/lib/constants";
import type { AgeGroup } from "@/lib/constants";
import type { ClientQuestion, QuestionType, QuizMode } from "@/lib/types";
import { startQuiz } from "@/app/actions/quiz";

type StoredQuiz = {
  testId: string;
  ageGroup: AgeGroup;
  questions: ClientQuestion[];
};

export function ModeSelector({
  userId,
  ageGroup,
}: {
  userId: string;
  ageGroup: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<QuizMode | null>(null);

  async function start(mode: QuizMode, category?: QuestionType) {
    setPending(mode);
    try {
      const { testId, questions } = await startQuiz({
        userId,
        ageGroup: ageGroup as AgeGroup,
        mode,
        category,
      });
      const payload: StoredQuiz = {
        testId,
        ageGroup: ageGroup as AgeGroup,
        questions,
      };
      window.sessionStorage.setItem(
        `quiz-${testId}`,
        JSON.stringify(payload),
      );
      router.push(`/quiz/${testId}`);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Тест эхлүүлэхэд алдаа";
      toast.error(`Алдаа: ${message}`);
      setPending(null);
    }
  }

  const modes: { id: QuizMode; emoji: string; gradient: string }[] = [
    {
      id: "leveled",
      emoji: "🎓",
      gradient: "from-blue-500/20 to-cyan-500/10",
    },
    {
      id: "mixed",
      emoji: "⚡",
      gradient: "from-amber-500/20 to-orange-500/10",
    },
    {
      id: "category",
      emoji: "🎯",
      gradient: "from-purple-500/20 to-fuchsia-500/10",
    },
  ];

  const types: QuestionType[] = ["email", "sms", "qr", "browser", "inbox_batch"];

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          ШУТИС · Кибер аюулгүй байдлын тэнхим
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan to-blue-2 bg-clip-text text-transparent sm:text-5xl">
          Тестийн горим сонгох
        </h1>
        <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
          Гурван сургалтын хэв шинжээс сонгоод фишинг илрүүлэх дадлагаа
          хийгээрэй.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3 mb-10">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              if (m.id === "category") return;
              start(m.id);
            }}
            disabled={pending !== null || m.id === "category"}
            aria-disabled={m.id === "category"}
            className={`group relative rounded-2xl border border-border/60 bg-gradient-to-br ${m.gradient} backdrop-blur p-6 text-left transition-all hover:border-primary/60 hover:shadow-[0_8px_24px_rgba(26,108,246,0.25)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-5xl mb-3">{m.emoji}</div>
            <div className="font-bold text-xl text-white mb-1">
              {MODE_LABELS[m.id]}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {MODE_DESCRIPTIONS[m.id]}
            </p>
            {pending === m.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                <div className="text-sm text-white">Бэлтгэж байна...</div>
              </div>
            )}
            {m.id !== "category" && (
              <div className="mt-4 text-xs text-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                Эхлүүлэх →
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎯</span>
          <h2 className="font-semibold text-lg text-white">
            Эсвэл нэг төрлөөр нь сонгоно уу
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Сонирхсон халдлагын төрлөөр л хязгаарлан дасгал хийе.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => start("category", t)}
              disabled={pending !== null}
              className="rounded-xl border border-border/60 bg-card/60 p-4 hover:border-primary/60 hover:bg-card/90 transition disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="text-3xl mb-1.5">{TYPE_ICONS[t]}</div>
              <div className="text-xs font-medium text-white">
                {TYPE_LABELS[t]}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
