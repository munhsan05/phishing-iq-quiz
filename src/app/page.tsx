"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition, type FormEvent } from "react";
import { toast } from "sonner";

import { AgeGroupSelector } from "@/components/age-group-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startQuiz } from "@/app/actions/quiz";
import { getOrCreateUserId } from "@/lib/user-id";
import type { AgeGroup } from "@/lib/constants";
import type { ClientQuestion } from "@/lib/types";

/**
 * Persisted payload the quiz runner reads from sessionStorage.
 * Key format: `quiz-${testId}`.
 */
type QuizStorage = {
  testId: string;
  ageGroup: AgeGroup;
  name: string;
  questions: ClientQuestion[];
};

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Experiment state: if the user completed a pre-test, this is set.
  const [experimentState, setExperimentState] = useState<{
    experimentId: string;
    ageGroup: AgeGroup;
    name: string;
  } | null>(null);

  // Detect returning post-test user on mount
  useEffect(() => {
    const stored = localStorage.getItem("phishing-quiz-experiment");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.experimentId && parsed.ageGroup && parsed.name) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setExperimentState(parsed);
        }
      } catch {
        localStorage.removeItem("phishing-quiz-experiment");
      }
    }
  }, []);

  function handleNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      toast.error("⚠️ Нэрээ оруулна уу!");
      return;
    }
    if (trimmed.length > 50) {
      toast.error("Нэр хэт урт байна (50 тэмдэгт)");
      return;
    }
    setSubmittedName(trimmed);
  }

  function handleAgeSelect(ageGroup: AgeGroup) {
    if (!submittedName) {
      toast.error("⚠️ Нэрээ оруулна уу!");
      return;
    }
    startTransition(async () => {
      try {
        const userId = getOrCreateUserId();
        const { testId, experimentId, questions } = await startQuiz({
          userId,
          name: submittedName,
          ageGroup,
        });

        // Store experiment state so post-test can find the pre-test
        localStorage.setItem(
          "phishing-quiz-experiment",
          JSON.stringify({ experimentId, ageGroup, name: submittedName }),
        );

        const payload: QuizStorage = {
          testId,
          ageGroup,
          name: submittedName,
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
          err instanceof Error
            ? err.message
            : "Тест эхлүүлэхэд алдаа гарлаа";
        toast.error(`Алдаа: ${message}`);
      }
    });
  }

  function handlePostTestStart() {
    if (!experimentState) return;
    startTransition(async () => {
      try {
        const userId = getOrCreateUserId();
        const { testId, questions } = await startQuiz({
          userId,
          name: experimentState.name,
          ageGroup: experimentState.ageGroup,
          experimentId: experimentState.experimentId,
        });

        const payload: QuizStorage = {
          testId,
          ageGroup: experimentState.ageGroup,
          name: experimentState.name,
          questions,
        };
        window.sessionStorage.setItem(
          `quiz-${testId}`,
          JSON.stringify(payload),
        );
        localStorage.removeItem("phishing-quiz-experiment");
        setExperimentState(null);
        router.push(`/quiz/${testId}`);
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error ? err.message : "Post-test эхлүүлэхэд алдаа";
        toast.error(`Алдаа: ${message}`);
      }
    });
  }

  function handleResetExperiment() {
    localStorage.removeItem("phishing-quiz-experiment");
    setExperimentState(null);
  }

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        {/* Academic header */}
        <div className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          ШУТИС · Кибер аюулгүй байдлын тэнхим · 2026
        </div>

        {/* Hero */}
        <div className="text-center">
          <h1 className="font-sans text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Фишинг
            <br />
            Илрүүлэх
            <br />
            <span className="bg-gradient-to-br from-cyan to-blue-2 bg-clip-text text-transparent">
              Вэб Сайт
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Жинхэнэ имэйл болон фишинг халдлагыг ялган таних чадвараа шалгаарай.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-6 text-center">
          <div>
            <div className="font-mono text-2xl font-bold text-white">
              3<span className="ml-1 text-sm text-cyan">бүлэг</span>
            </div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Насны сегмент
            </div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="font-mono text-2xl font-bold text-white">
              30<span className="text-cyan">+</span>
            </div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Туршилтын сценари
            </div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div>
            <div className="font-mono text-2xl font-bold text-white">10</div>
            <div className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Асуулт · 30 сек
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md sm:p-8">
          {experimentState ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-lg border border-border/60 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                📋 <strong className="text-white">Post-test</strong>
              </div>
              <div className="text-base text-white">
                Сайн байна уу,{" "}
                <span className="font-semibold text-cyan">
                  {experimentState.name}
                </span>
                ! Pre-test дууссан. Одоо Post-test өгнө үү.
              </div>
              <div className="rounded-lg border border-blue-2/30 bg-blue-2/5 px-4 py-3 text-sm text-muted-foreground">
                Ижил асуултууд өөр дарааллаар гарна. Pre-test-ийн тайлбар,
                зөвлөмжийг санаж хариулаарай.
              </div>
              <Button
                type="button"
                size="lg"
                disabled={isPending}
                onClick={handlePostTestStart}
                className="h-12 w-full bg-gradient-to-r from-blue to-cyan text-base text-white shadow-[0_8px_24px_rgba(26,108,246,0.35)]"
              >
                {isPending ? "Бэлтгэж байна..." : "Post-test эхлүүлэх →"}
              </Button>
              <button
                type="button"
                onClick={handleResetExperiment}
                className="text-center text-xs text-muted-foreground hover:text-white"
              >
                Шинэ туршилт эхлүүлэх
              </button>
            </div>
          ) : !submittedName ? (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
              <div className="mb-2 rounded-lg border border-border/60 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                📋 <strong className="text-white">Нэвтрэх</strong>
              </div>
              <Label
                htmlFor="username-input"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                <span aria-hidden="true">👤</span> Оролцогч нэрээ оруулна уу.
              </Label>
              <Input
                id="username-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Нэр эсвэл хоч оруулна уу..."
                maxLength={50}
                autoComplete="off"
                className="h-12 text-base"
                disabled={isPending}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isPending || name.trim().length === 0}
                className="h-12 w-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(26,108,246,0.35)] hover:bg-primary/90"
              >
                Үргэлжлүүлэх →
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>⏱ 10+ асуулт</span>
                <span>⚡ 30 сек / асуулт</span>
                <span>🔒 Дахин өгөх</span>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() => setSubmittedName(null)}
                className="self-start text-xs uppercase tracking-wider text-muted-foreground hover:text-white"
                disabled={isPending}
              >
                ← Буцах
              </button>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                <span aria-hidden="true">🎂</span> Насны бүлэг
              </div>
              <div className="text-base text-white">
                Сайн байна уу,{" "}
                <span className="font-semibold text-cyan">
                  {submittedName}
                </span>
                ! Насны бүлгээ сонгоно уу.
              </div>
              <AgeGroupSelector
                onSelect={handleAgeSelect}
                disabled={isPending}
              />
              {isPending ? (
                <div className="text-center text-sm text-muted-foreground">
                  Тестийг бэлтгэж байна...
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Leaderboard link */}
        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-accent/60 hover:text-white"
          >
            <span aria-hidden="true">👑</span> Топ оноо
          </Link>
        </div>
      </div>
    </main>
  );
}
