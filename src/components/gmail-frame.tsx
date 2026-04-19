"use client";

import type { EmailContent } from "@/lib/types";

type GmailFrameProps = {
  content: EmailContent;
};

/** Decorative Gmail-inspired frame that wraps each email question. */
export function GmailFrame({ content }: GmailFrameProps) {
  const initial = content.from.charAt(0).toUpperCase();
  const hue =
    content.from.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="overflow-hidden rounded-lg border border-[#dadce0] bg-white shadow-lg"
      role="article"
      aria-label={`Имэйл: ${content.from} — ${content.subject}`}
    >
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-[#f6f8fc] px-4 py-2">
        <span className="text-[#5f6368] text-lg">☰</span>
        <span className="text-[#c5221f] text-xl font-bold tracking-tight select-none">
          Gmail
        </span>
        <div className="mx-3 flex-1">
          <div className="flex items-center gap-2 rounded-full bg-[#eaf1fb] px-4 py-1.5 text-sm text-[#5f6368]">
            <span className="text-base">🔍</span>
            <span className="hidden sm:inline">Имэйл хайх</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#5f6368]">
          <span className="text-lg">⚙</span>
          <div className="flex size-8 items-center justify-center rounded-full bg-[#1a73e8] text-sm font-medium text-white">
            О
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-[180px] shrink-0 border-r border-[#dadce0] bg-[#f6f8fc] py-3 md:block">
          <nav className="flex flex-col gap-0.5 px-2 text-[13px]">
            <SidebarItem icon="📥" label="Inbox" count={1} active />
            <SidebarItem icon="⭐" label="Starred" />
            <SidebarItem icon="📤" label="Sent" />
            <SidebarItem icon="📝" label="Drafts" />
            <SidebarItem icon="🗑" label="Trash" />
            <SidebarItem icon="⚠" label="Spam" />
            <div className="my-2 border-t border-[#dadce0]" />
            <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#5f6368]">
              Labels
            </div>
            <SidebarItem icon="🏷" label="Ажил" />
            <SidebarItem icon="🏷" label="Хувийн" />
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-1.5 text-[#5f6368]">
            <div className="flex items-center gap-3 text-sm">
              <span title="Буцах">←</span>
              <span title="Архивлах">📦</span>
              <span title="Устгах">🗑</span>
              <span title="Уншаагүй">✉</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span title="Шошго нэмэх">🏷</span>
              <span title="Дэлгэрэнгүй">⋮</span>
            </div>
          </div>

          <div className="border-b border-[#f0f0f0] px-4 py-3 sm:px-6">
            <h2 className="text-lg font-normal text-[#202124] leading-snug">
              {content.subject}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded bg-[#f0f0f0] px-2 py-0.5 text-[11px] text-[#5f6368]">
                Inbox
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-4 sm:px-6">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: `hsl(${hue}, 55%, 50%)` }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#202124]">
                  {content.from.split("<")[0].trim()}
                </span>
                <span className="text-xs text-[#5f6368]">
                  &lt;
                  {content.from.includes("<")
                    ? content.from.split("<")[1]?.replace(">", "")
                    : content.from}
                  &gt;
                </span>
              </div>
              <div className="text-xs text-[#5f6368]">рүү: оролцогч</div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[#5f6368]">
              <span className="text-xs">Яг одоо</span>
              <span className="cursor-default text-lg" title="Одтой тэмдэглэх">
                ☆
              </span>
              <span className="cursor-default" title="Хариулах">
                ↩
              </span>
              <span className="cursor-default">⋮</span>
            </div>
          </div>

          <div className="px-4 pb-5 text-sm leading-relaxed text-[#3c4043] whitespace-pre-line sm:px-6 sm:pl-[4.5rem]">
            {content.body}

            {content.url ? (
              <div className="mt-4">
                <span className="inline-flex items-center gap-1 rounded border border-[#dadce0] bg-[#f8f9fa] px-2 py-1 font-mono text-xs text-[#1a73e8] hover:bg-[#e8f0fe]">
                  🔗 {content.url}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 border-t border-[#f0f0f0] px-4 py-3 sm:px-6 sm:pl-[4.5rem]">
            <button
              type="button"
              disabled
              className="rounded-full border border-[#dadce0] px-4 py-1.5 text-sm text-[#5f6368]"
            >
              ↩ Хариулах
            </button>
            <button
              type="button"
              disabled
              className="rounded-full border border-[#dadce0] px-4 py-1.5 text-sm text-[#5f6368]"
            >
              ↪ Дамжуулах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  count,
  active,
}: {
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full px-3 py-1.5 ${
        active
          ? "bg-[#d3e3fd] font-semibold text-[#001d35]"
          : "text-[#5f6368] hover:bg-[#e8eaed]"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {count != null && <span className="text-xs font-bold">{count}</span>}
    </div>
  );
}
