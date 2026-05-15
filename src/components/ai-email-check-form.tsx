"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VerdictBadge, type Verdict } from "@/components/verdict-badge";

const MAX_CHARS = 5000;

type Result = {
  verdict: Verdict;
  confidence: number;
  summary: string;
  remaining: number;
};

export function AIEmailCheckForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trimmed = text.trim();
  const overLimit = text.length > MAX_CHARS;
  const disabled = isPending || trimmed.length === 0 || overLimit;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailText: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Алдаа гарлаа");
          if (res.status === 429) toast.error(data.error);
          return;
        }
        setResult(data);
      } catch (err) {
        console.error(err);
        setError("Сүлжээний алдаа. Дахин оролдоно уу.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Имэйлийн агуулгыг энд буулгана уу..."
          rows={10}
          className="resize-y"
          aria-label="Имэйлийн агуулга"
        />
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className={overLimit ? "text-red-400" : ""}>
            {text.length} / {MAX_CHARS}
          </span>
          <Button type="submit" disabled={disabled}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI шалгаж байна...
              </>
            ) : (
              "Шалгах"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <VerdictBadge verdict={result.verdict} confidence={result.confidence} />
          <p className="text-sm leading-relaxed text-white/85">{result.summary}</p>
          <p className="text-xs text-white/50">
            Үлдсэн шалгалт өнөөдөр: {result.remaining}
          </p>
        </div>
      )}
    </div>
  );
}
