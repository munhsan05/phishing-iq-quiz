import { AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Verdict = "phishing" | "legitimate" | "uncertain";

type Props = {
  verdict: Verdict;
  confidence: number;
  className?: string;
};

const VERDICT_LABEL: Record<Verdict, string> = {
  phishing: "Фишинг",
  legitimate: "Жинхэнэ",
  uncertain: "Тодорхойгүй",
};

const VERDICT_ICON: Record<Verdict, React.ComponentType<{ className?: string }>> = {
  phishing: AlertTriangle,
  legitimate: CheckCircle2,
  uncertain: HelpCircle,
};

const VERDICT_STYLE: Record<Verdict, string> = {
  phishing: "bg-red-500/15 text-red-300 ring-red-500/30",
  legitimate: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  uncertain: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
};

export function VerdictBadge({ verdict, confidence, className }: Props) {
  const Icon = VERDICT_ICON[verdict];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1",
        VERDICT_STYLE[verdict],
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>
        {VERDICT_LABEL[verdict]} · {Math.round(confidence)}%
      </span>
    </div>
  );
}
