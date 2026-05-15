"use client";

import {
  ArrowLeft,
  Archive,
  CircleAlert,
  Trash2,
  MailQuestion,
  Clock,
  Folder,
  Tag,
  MoreVertical,
  Star,
  ChevronDown,
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

/** Splits body into main + signature on a "---" or "—" line. */
function splitSignature(body: string): {
  main: string;
  signature: string | null;
} {
  const sigPattern = /\n[—-]{2,}\n/;
  const idx = body.search(sigPattern);
  if (idx === -1) return { main: body, signature: null };
  return {
    main: body.slice(0, idx).trim(),
    signature: body.slice(idx).replace(/^\n[—-]+\n/, "").trim(),
  };
}

/** Authentic Gmail web message reader frame — no sidebar or top header. */
export function GmailFrame({ question }: GmailFrameProps) {
  const { name: senderName, email: senderEmail } = parseSender(
    question.emailFrom,
  );
  const initial = senderName.charAt(0).toUpperCase();
  const hue =
    senderEmail
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const { main, signature } = splitSignature(question.emailBody);

  return (
    <article
      className="overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-sm"
      role="article"
      aria-label={`Имэйл: ${senderName} — ${question.emailSubject}`}
    >
      {/* Action toolbar */}
      <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-4 py-2 text-[#5f6368]">
        <ArrowLeft className="size-5" aria-hidden />
        <span className="mx-1 h-5 w-px bg-[#dadce0]" />
        <Archive className="size-5" aria-hidden />
        <CircleAlert className="size-5" aria-hidden />
        <Trash2 className="size-5" aria-hidden />
        <span className="mx-1 h-5 w-px bg-[#dadce0]" />
        <MailQuestion className="size-5" aria-hidden />
        <Clock className="size-5" aria-hidden />
        <Folder className="size-5" aria-hidden />
        <Tag className="size-5" aria-hidden />
        <MoreVertical className="ml-auto size-5" aria-hidden />
      </div>

      {/* Subject + label */}
      <div className="border-b border-[#f0f0f0] px-5 py-4">
        <h2 className="text-xl font-normal leading-snug text-[#202124]">
          {question.emailSubject}
          <span className="ml-2 rounded bg-[#e8eaed] px-2 py-0.5 align-middle text-xs font-medium text-[#5f6368]">
            Inbox
          </span>
        </h2>
      </div>

      {/* Sender block */}
      <div className="flex items-start gap-3 px-5 py-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: `hsl(${hue}, 60%, 50%)` }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-[14px] font-medium text-[#202124]">
              {senderName}
            </span>
            <span className="text-[12px] text-[#5f6368]">
              &lt;{senderEmail}&gt;
            </span>
            <span className="ml-auto text-[12px] text-[#5f6368]">10:23 AM</span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[#5f6368]">
            <span>to me</span>
            <ChevronDown className="size-3" aria-hidden />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[#5f6368]">
          <Star className="size-5" aria-hidden />
          <CornerUpLeft className="size-5" aria-hidden />
          <MoreVertical className="size-5" aria-hidden />
        </div>
      </div>

      {/* Body */}
      <div className="whitespace-pre-wrap px-5 py-3 text-[14px] leading-[1.6] text-[#202124]">
        {main}
        {signature && (
          <div className="mt-4 border-t border-[#f0f0f0] pt-3 text-[#5f6368]">
            {signature}
          </div>
        )}
      </div>

      {/* URL field (if present) */}
      {question.emailUrl && (
        <div className="px-5 pb-3">
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
      <div className="flex items-center gap-2 border-t border-[#f0f0f0] px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-[#dadce0] px-4 py-1.5 text-[13px] text-[#5f6368] hover:bg-[#f6f8fc]"
        >
          <CornerUpLeft className="size-4" aria-hidden /> Хариулах
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-[#dadce0] px-4 py-1.5 text-[13px] text-[#5f6368] hover:bg-[#f6f8fc]"
        >
          <CornerDownLeft className="size-4" aria-hidden /> Дамжуулах
        </button>
      </div>
    </article>
  );
}
