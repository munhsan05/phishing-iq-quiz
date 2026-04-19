"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { GmailFrame } from "@/components/gmail-frame";
import { SmsCard } from "@/components/sms-card";
import { QrCard } from "@/components/qr-card";
import { BrowserWarning } from "@/components/browser-warning";
import { InboxTriage } from "@/components/inbox-triage";
import { QuestionTimer } from "@/components/question-timer";
import { submitAnswer, finishQuiz } from "@/app/actions/quiz";
import { TYPE_TIME_LIMITS_SEC, TYPE_LABELS } from "@/lib/constants";
import type { ClientQuestion, AnswerInput } from "@/lib/types";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
type AnswerInputNoTime = DistributiveOmit<AnswerInput, "timeTakenMs">;

type Props = {
  testId: string;
  questions: ClientQuestion[];
};

export function QuizRunner({ testId, questions }: Props) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [startAt, setStartAt] = useState(Date.now());
  const [, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  const current = questions[idx];
  if (!current) return null;
  const timeLimit = TYPE_TIME_LIMITS_SEC[current.type];

  function handleAnswer(input: AnswerInputNoTime) {
    if (isPending) return;
    setIsPending(true);
    const timeTakenMs = Date.now() - startAt;
    const answerInput = { ...input, timeTakenMs } as AnswerInput;

    startTransition(async () => {
      try {
        await submitAnswer(testId, answerInput);
        if (idx + 1 >= questions.length) {
          await finishQuiz(testId);
          router.push(`/result/${testId}`);
        } else {
          setIdx(idx + 1);
          setStartAt(Date.now());
          setIsPending(false);
        }
      } catch (err) {
        console.error("submitAnswer failed", err);
        setIsPending(false);
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {idx + 1} / {questions.length}
          <span className="ml-2 text-xs">— {TYPE_LABELS[current.type]}</span>
        </div>
        <QuestionTimer
          durationSec={timeLimit}
          resetKey={String(current.id)}
          onExpire={() => {
            if (current.type === "inbox_batch") {
              handleAnswer({
                kind: "inbox",
                batchId: String(current.id),
                selectedItemIds: [],
              });
            } else if (current.type === "browser") {
              handleAnswer({
                kind: "browser",
                questionId: Number(current.id),
                choice: "back",
              });
            } else {
              handleAnswer({
                kind: "binary",
                questionId: Number(current.id),
                choice: "legit",
              });
            }
          }}
        />
      </div>

      {current.type === "email" && <GmailFrame content={current.content} />}
      {current.type === "sms" && <SmsCard content={current.content} />}
      {current.type === "qr" && <QrCard content={current.content} />}
      {current.type === "browser" && (
        <BrowserWarning content={current.content} />
      )}
      {current.type === "inbox_batch" && (
        <InboxTriage
          batch={current}
          onSubmit={(ids) =>
            handleAnswer({
              kind: "inbox",
              batchId: String(current.id),
              selectedItemIds: ids,
            })
          }
        />
      )}

      {current.type !== "inbox_batch" && current.type !== "browser" && (
        <div className="mt-6 flex gap-3 justify-center">
          <button
            disabled={isPending}
            onClick={() =>
              handleAnswer({
                kind: "binary",
                questionId: Number(current.id),
                choice: "phish",
              })
            }
            className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            🎣 Фишинг
          </button>
          <button
            disabled={isPending}
            onClick={() =>
              handleAnswer({
                kind: "binary",
                questionId: Number(current.id),
                choice: "legit",
              })
            }
            className="px-6 py-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
          >
            ✓ Жинхэнэ
          </button>
        </div>
      )}

      {current.type === "browser" && (
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <button
            disabled={isPending}
            onClick={() =>
              handleAnswer({
                kind: "browser",
                questionId: Number(current.id),
                choice: "back",
              })
            }
            className="px-5 py-2.5 rounded-md bg-secondary hover:bg-secondary/80 font-semibold disabled:opacity-50"
          >
            ← Буцах
          </button>
          <button
            disabled={isPending}
            onClick={() =>
              handleAnswer({
                kind: "browser",
                questionId: Number(current.id),
                choice: "proceed",
              })
            }
            className="px-5 py-2.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold disabled:opacity-50"
          >
            Үргэлжлүүлэх
          </button>
          <button
            disabled={isPending}
            onClick={() =>
              handleAnswer({
                kind: "browser",
                questionId: Number(current.id),
                choice: "report",
              })
            }
            className="px-5 py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            🚩 Report
          </button>
        </div>
      )}
    </div>
  );
}
