import Link from "next/link";
import { ShieldCheck, Home, Lightbulb, Bot, Trophy } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Нүүр", icon: Home },
  { href: "/tips", label: "Зөвлөмж", icon: Lightbulb },
  { href: "/check", label: "AI шалгах", icon: Bot },
  { href: "/leaderboard", label: "Тэргүүлэгчид", icon: Trophy },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2 text-slate-900 transition">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-sm transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Фишинг IQ
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
