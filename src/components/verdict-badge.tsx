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
  phishing: "bg-red-50 text-red-700 ring-red-200",
  legitimate: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  uncertain: "bg-amber-50 text-amber-700 ring-amber-200",
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
