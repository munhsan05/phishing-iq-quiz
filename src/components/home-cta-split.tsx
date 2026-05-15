import Link from "next/link";
import { Bot, GraduationCap, ArrowRight } from "lucide-react";

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
      />
    </div>
  );
}

type CardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  cta: string;
} & (
  | { as: "button"; disabled?: boolean; onClick?: () => void }
  | { as: "link"; href: string }
);

function CtaCard(props: CardProps) {
  const { icon: Icon, title, body, cta } = props;
  const inner = (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-5 text-left transition hover:border-cyan-400/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
      <Icon className="h-7 w-7 text-cyan-300" aria-hidden />
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="flex-1 text-sm text-white/70">{body}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
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
