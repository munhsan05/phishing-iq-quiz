import Link from "next/link";
import { Bot, GraduationCap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  quizHref: string;
  quizDisabled?: boolean;
  onQuizClick?: () => void;
};

export function HomeCtaSplit({ quizHref, quizDisabled, onQuizClick }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CtaCard
        as="button"
        icon={GraduationCap}
        title="Quiz өгөх"
        body="6 имэйлийн жишээгээр фишинг таних чадвараа сорь."
        cta="Эхлэх"
        disabled={quizDisabled}
        onClick={onQuizClick}
      />
      <CtaCard
        as="link"
        icon={Bot}
        title="AI имэйл шалгах"
        body="Сэжигтэй имэйлээ AI-аар 1 секундэд шалгана."
        cta="Шалгах"
        href="/check"
        variant="brand"
      />
    </div>
  );
}

type CardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta: string;
  variant?: "default" | "brand";
} & (
  | { as: "button"; disabled?: boolean; onClick?: () => void }
  | { as: "link"; href: string }
);

function CtaCard(props: CardProps) {
  const { icon: Icon, title, body, cta } = props;
  const isBrand = props.variant === "brand";
  const inner = (
    <div className={cn(
      "flex h-full flex-col gap-3 rounded-xl p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
      isBrand
        ? "border border-cyan-600 bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30"
        : "border border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md"
    )}>
      <Icon className={cn("h-7 w-7", isBrand ? "text-white" : "text-cyan-600")} aria-hidden />
      <h3 className={cn("text-lg font-bold", isBrand ? "text-white" : "text-slate-900")}>
        {title}
      </h3>
      <p className={cn("flex-1 text-sm", isBrand ? "text-white/85" : "text-slate-600")}>
        {body}
      </p>
      <span className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold",
        isBrand ? "text-white" : "text-cyan-600"
      )}>
        {cta} <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  );

  if (props.as === "link") {
    return (
      <Link href={props.href} className="block">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className="block w-full"
    >
      {inner}
    </button>
  );
}
