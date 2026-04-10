"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GmailFrame } from "@/components/gmail-frame";
import { QuestionTimer } from "@/components/question-timer";
import { submitAnswer, finishQuiz } from "@/app/actions/quiz";
import type { AgeGroup } from "@/lib/constants";
import { QUIZ_TIME_PER_QUESTION_SEC } from "@/lib/constants";
import type { ClientQuestion, AnswerFeedback } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuizRunnerProps = {
  testId: string;
  questions: ClientQuestion[];
  ageGroup: AgeGroup;
};

type Phase = "question" | "feedback" | "finishing";

/**
 * Main quiz runner: walks the user through `questions` one at a time,
 * renders each as an email card, collects their phishing/legit verdict,
 * shows per-question feedback, then calls `finishQuiz` and routes to
 * `/result/{testId}`.
 */
export function QuizRunner({ testId, questions, ageGroup }: QuizRunnerProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Per-question start time (for `timeTakenMs`).
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(() =>
    Date.now(),
  );
  // Total quiz start time (for `totalTimeMs`).
  const [sessionStartedAt] = useState<number>(() => Date.now());

  const current = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;

  // Reset per-question start time whenever we land on a new question.
  useEffect(() => {
    if (phase === "question") {
      setQuestionStartedAt(Date.now());
      setTimedOut(false);
    }
  }, [currentIndex, phase]);

  const handleAnswer = useCallback(
    async (selectedIsPhish: boolean | null) => {
      if (phase !== "question" || isSubmitting) return;
      setIsSubmitting(true);

      const timeTakenMs = Math.max(0, Date.now() - questionStartedAt);
      if (selectedIsPhish === null) setTimedOut(true);

      try {
        const fb = await submitAnswer({
          testId,
          questionId: current.id,
          selectedIsPhish,
          timeTakenMs,
        });
        setFeedback(fb);
        if (fb.isCorrect) setScore((s) => s + 1);
        setPhase("feedback");
      } catch (err) {
        console.error(err);
        toast.error(
          err instanceof Error
            ? `Хариулт хадгалахад алдаа: ${err.message}`
            : "Хариулт хадгалахад алдаа гарлаа",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [phase, isSubmitting, questionStartedAt, testId, current],
  );

  const handleNext = useCallback(async () => {
    if (phase !== "feedback") return;

    if (!isLast) {
      setFeedback(null);
      setPhase("question");
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Last question — finalise.
    setPhase("finishing");
    const totalTimeMs = Math.max(0, Date.now() - sessionStartedAt);
    try {
      await finishQuiz({ testId, score, totalTimeMs });
      router.push(`/result/${testId}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? `Тест дуусгахад алдаа: ${err.message}`
          : "Тест дуусгахад алдаа гарлаа",
      );
      setPhase("feedback"); // let user retry
    }
  }, [phase, isLast, testId, score, sessionStartedAt, router]);

  const handleTimerExpire = useCallback(() => {
    if (phase === "question") {
      void handleAnswer(null);
    }
  }, [phase, handleAnswer]);

  // Keyboard shortcuts: P = phishing, L = legit, Enter = next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (phase === "question" && !isSubmitting) {
        if (key === "p") {
          e.preventDefault();
          void handleAnswer(true);
        } else if (key === "l") {
          e.preventDefault();
          void handleAnswer(false);
        }
      } else if (phase === "feedback") {
        if (e.key === "Enter") {
          e.preventDefault();
          void handleNext();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, isSubmitting, handleAnswer, handleNext]);

  if (!current) return null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Header: progress + score */}
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Насны бүлэг {ageGroup}
          </span>
          <span className="font-mono text-lg font-bold text-white">
            Асуулт {currentIndex + 1}/{total}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Оноо
          </span>
          <span className="font-mono text-2xl font-extrabold text-cyan">
            {score}
            <span className="text-base text-muted-foreground">/{total}</span>
          </span>
        </div>
      </div>

      {/* Timer */}
      <QuestionTimer
        durationSec={QUIZ_TIME_PER_QUESTION_SEC}
        onExpire={handleTimerExpire}
        resetKey={current.id}
        paused={phase !== "question"}
      />

      {/* Progress bar across questions */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue to-cyan transition-all duration-300"
          style={{
            width: `${(((currentIndex + (phase === "feedback" ? 1 : 0)) / total) * 100).toFixed(2)}%`,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Gmail email frame */}
      <GmailFrame question={current} />

      {/* Feedback panel — shown after the user answers */}
      {phase === "feedback" && feedback ? (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            timedOut
              ? "border-yellow-300 bg-yellow-50 text-yellow-900"
              : feedback.isCorrect
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-rose-300 bg-rose-50 text-rose-900",
          )}
          role="status"
          aria-live="assertive"
        >
          <div className="text-base font-bold">
            {timedOut
              ? `⏰ Хугацаа дууслаа! — ${feedback.correctIsPhish ? "🎣 Фишинг имэйл байлаа" : "✉️ Жинхэнэ имэйл байлаа"}`
              : feedback.isCorrect
                ? `✅ Зөв! — ${feedback.correctIsPhish ? "🎣 Фишинг имэйл" : "✉️ Жинхэнэ имэйл"}`
                : `❌ Буруу! — ${feedback.correctIsPhish ? "🎣 Энэ нь Фишинг имэйл байсан" : "✉️ Энэ нь Жинхэнэ имэйл байсан"}`}
          </div>
          <div className="mt-2 text-[0.95em] leading-relaxed opacity-90">
            <span className="font-semibold">Тайлбар: </span>
            {feedback.explanation}
          </div>
          <div className="mt-2 text-[0.95em] leading-relaxed opacity-90">
            <span className="font-semibold">Зөвлөмж: </span>
            {feedback.recommendation}
          </div>
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {phase === "question" ? (
          <>
            <Button
              type="button"
              size="lg"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => handleAnswer(true)}
              className="h-14 flex-1 text-base font-semibold"
              aria-keyshortcuts="P"
            >
              ⚠️ Фишинг
              <span className="ml-2 rounded bg-black/10 px-1.5 py-0.5 text-[0.65rem] font-mono">
                P
              </span>
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={() => handleAnswer(false)}
              className="h-14 flex-1 bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
              aria-keyshortcuts="L"
            >
              ✅ Жинхэнэ
              <span className="ml-2 rounded bg-black/20 px-1.5 py-0.5 text-[0.65rem] font-mono">
                L
              </span>
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="lg"
            disabled={phase === "finishing"}
            onClick={handleNext}
            className="h-14 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {phase === "finishing"
              ? "Тест дуусгаж байна..."
              : isLast
                ? "Үр дүн харах →"
                : "Дараагийн асуулт →"}
          </Button>
        )}
      </div>

      {/* Keyboard hint */}
      <div className="text-center text-xs text-muted-foreground">
        Гарын товчлол:{" "}
        <kbd className="rounded border border-border bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem]">
          P
        </kbd>{" "}
        — Фишинг,{" "}
        <kbd className="rounded border border-border bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem]">
          L
        </kbd>{" "}
        — Жинхэнэ,{" "}
        <kbd className="rounded border border-border bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem]">
          Enter
        </kbd>{" "}
        — Дараагийн
      </div>
    </div>
  );
}
