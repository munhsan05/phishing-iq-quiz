"use client";

import {
  Menu,
  Search,
  Settings,
  Grip,
  PenSquare,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  ShoppingBag,
  Plane,
  ChevronDown,
  ArrowLeft,
  Archive,
  CircleAlert,
  Trash2,
  MailQuestion,
  Clock as ClockIcon,
  Folder,
  Tag,
  MoreVertical,
  Star as StarIcon,
  CornerUpLeft,
  CornerDownLeft,
} from "lucide-react";

import type { ClientQuestion } from "@/lib/types";

type GmailFrameProps = {
  question: ClientQuestion;
};

/** Parses "Name <email@domain>" or "Name email@domain" into parts. */
function parseSender(raw: string): { name: string; email: string } {
  const match = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1]!.trim(), email: match[2]!.trim() };
  const parts = raw.split(/\s+/);
  if (parts.length > 1 && parts[parts.length - 1]!.includes("@")) {
    return {
      name: parts.slice(0, -1).join(" "),
      email: parts[parts.length - 1]!,
    };
  }
  return { name: raw, email: raw };
}

function splitSignature(body: string): { main: string; signature: string | null } {
  const sigPattern = /\n[—-]{2,}\n/;
  const idx = body.search(sigPattern);
  if (idx === -1) return { main: body, signature: null };
  return {
    main: body.slice(0, idx).trim(),
    signature: body.slice(idx).replace(/^\n[—-]+\n/, "").trim(),
  };
}

type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { icon: Inbox, label: "Ирсэн имэйл", count: 1, active: true },
  { icon: Star, label: "Одтой" },
  { icon: Clock, label: "Түр хойшлуулсан" },
  { icon: Send, label: "Илгээсэн" },
  { icon: FileText, label: "Ноорог" },
  { icon: ShoppingBag, label: "Худалдан авалтууд" },
  { icon: Plane, label: "Аялал" },
  { icon: ChevronDown, label: "Илүүг" },
];

export function GmailFrame({ question }: GmailFrameProps) {
  const { name: senderName, email: senderEmail } = parseSender(question.emailFrom);
  const initial = senderName.charAt(0).toUpperCase();
  const hue = senderEmail
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const { main, signature } = splitSignature(question.emailBody);

  return (
    <article
      className="overflow-hidden rounded-xl border border-[#dadce0] bg-white shadow-lg"
      role="article"
      aria-label={`Имэйл: ${senderName} — ${question.emailSubject}`}
    >
      {/* === Top header (Gmail chrome) === */}
      <div className="flex items-center gap-2 border-b border-[#dadce0] bg-white px-3 py-2 sm:gap-3 sm:px-4">
        <Menu className="size-5 shrink-0 text-[#5f6368]" aria-hidden />
        <div className="flex items-center gap-1">
          <span className="select-none text-[22px] font-medium leading-none tracking-tight text-[#c5221f]">
            Gmail
          </span>
        </div>
        <div className="mx-1 flex h-10 flex-1 items-center gap-2 rounded-full bg-[#eaf1fb] px-3 text-[#5f6368] sm:mx-3 sm:h-12 sm:max-w-[720px] sm:px-5">
          <Search className="size-4 shrink-0 sm:size-5" aria-hidden />
          <span className="hidden text-sm sm:inline">Цахим шуудан хайх</span>
        </div>
        <Settings className="hidden size-5 text-[#5f6368] sm:block" aria-hidden />
        <Grip className="hidden size-5 text-[#5f6368] sm:block" aria-hidden />
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}
        >
          {initial}
        </div>
      </div>

      {/* === Two-column layout: sidebar + email reader === */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-[212px] shrink-0 border-r border-[#dadce0] py-2 md:block">
          {/* Compose button */}
          <div className="px-3 pb-2">
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-[#c2e7ff] px-4 py-3 text-sm font-medium text-[#001d35] shadow-sm hover:bg-[#b3deff]"
            >
              <PenSquare className="size-5" aria-hidden />
              Имэйл бичих
            </button>
          </div>
          {/* Nav items */}
          <nav className="space-y-0.5 px-1 text-[14px]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-r-full px-4 py-1.5 ${
                    item.active
                      ? "bg-[#d3e3fd] font-medium text-[#001d35]"
                      : "text-[#444746] hover:bg-[#ebebeb]"
                  }`}
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-xs font-medium">{item.count}</span>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Email reader */}
        <div className="min-w-0 flex-1">
          {/* Action toolbar */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-[#f0f0f0] px-4 py-2 text-[#5f6368]">
            <ArrowLeft className="size-5" aria-hidden />
            <span className="mx-1 h-5 w-px bg-[#dadce0]" />
            <Archive className="size-5" aria-hidden />
            <CircleAlert className="size-5" aria-hidden />
            <Trash2 className="size-5" aria-hidden />
            <span className="mx-1 h-5 w-px bg-[#dadce0]" />
            <MailQuestion className="size-5" aria-hidden />
            <ClockIcon className="size-5" aria-hidden />
            <Folder className="size-5" aria-hidden />
            <Tag className="size-5" aria-hidden />
            <MoreVertical className="ml-auto size-5" aria-hidden />
          </div>

          {/* Subject + Inbox tag */}
          <div className="flex items-center gap-3 border-b border-[#f0f0f0] px-6 py-4">
            <h2 className="flex-1 text-[22px] font-normal leading-snug text-[#202124]">
              {question.emailSubject}
            </h2>
            <span className="shrink-0 rounded bg-[#e8eaed] px-2 py-0.5 text-xs font-medium text-[#5f6368]">
              Ирсэн имэйл
            </span>
          </div>

          {/* Sender block */}
          <div className="flex items-start gap-3 px-6 py-4">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
              style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-[14px] font-medium text-[#202124]">
                  {senderName}
                </span>
                <span className="text-[13px] text-[#5f6368]">
                  &lt;{senderEmail}&gt;
                </span>
                <span className="ml-auto text-[12px] text-[#5f6368]">
                  10:23 AM (4 минутын өмнө)
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[13px] text-[#5f6368]">
                <span>над руу</span>
                <ChevronDown className="size-3.5" aria-hidden />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[#5f6368]">
              <StarIcon className="size-5" aria-hidden />
              <CornerUpLeft className="size-5" aria-hidden />
              <MoreVertical className="size-5" aria-hidden />
            </div>
          </div>

          {/* Body */}
          <div className="whitespace-pre-wrap px-4 pb-4 text-[13px] leading-[1.65] text-[#202124] md:px-6 md:text-[14px]">
            {main}
            {signature && (
              <div className="mt-4 border-t border-[#f0f0f0] pt-3 text-[#5f6368]">
                {signature}
              </div>
            )}
          </div>

          {/* Optional URL */}
          {question.emailUrl && (
            <div className="px-6 pb-4">
              <a
                className="break-all text-[14px] text-[#1a73e8] underline decoration-[#1a73e8]/40 underline-offset-2"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {question.emailUrl}
              </a>
            </div>
          )}

          {/* Reply chips */}
          <div className="flex items-center gap-2 border-t border-[#f0f0f0] px-6 py-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#dadce0] bg-white px-5 py-2 text-[14px] font-medium text-[#5f6368] hover:bg-[#f6f8fc]"
            >
              <CornerUpLeft className="size-4" /> Хариу бичих
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#dadce0] bg-white px-5 py-2 text-[14px] font-medium text-[#5f6368] hover:bg-[#f6f8fc]"
            >
              <CornerDownLeft className="size-4" /> Дамжуулах
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
