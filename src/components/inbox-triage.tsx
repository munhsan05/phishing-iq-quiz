"use client";

import { useState } from "react";
import type { ClientQuestion } from "@/lib/types";

type InboxBatch = Extract<ClientQuestion, { type: "inbox_batch" }>;

export function InboxTriage({
  batch,
  onSubmit,
}: {
  batch: InboxBatch;
  onSubmit: (selectedItemIds: number[]) => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return (
    <div className="mx-auto w-full max-w-4xl">
      {batch.context && (
        <div className="mb-4 rounded-xl border border-blue-2/30 bg-blue-2/10 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-blue-2 mb-1">
            📥 Сценари
          </div>
          <p className="text-sm text-white">{batch.context}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Бүх сэжигтэй имэйлийг тэмдэглэн "Спамд мэдэгдэх" товч дарна уу.
          </p>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-border bg-card divide-y divide-border/60">
        <div className="bg-card/80 px-4 py-2 flex items-center justify-between border-b border-border">
          <div className="text-sm font-semibold text-white">
            📥 Inbox ({batch.items.length})
          </div>
          <div className="text-xs text-muted-foreground">
            ⚙️ Шинэчлэх
          </div>
        </div>
        {batch.items.map((item) => {
          const isSel = selected.has(item.id);
          const initial = item.content.from.charAt(0).toUpperCase();
          const hue =
            item.content.from
              .split("")
              .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
          return (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-4 cursor-pointer transition ${
                isSel
                  ? "bg-red-900/25 border-l-4 border-l-red-500"
                  : "hover:bg-secondary/30 border-l-4 border-l-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => toggle(item.id)}
                className="mt-1.5 h-4 w-4 accent-red-500"
                aria-label={`Фишинг гэж тэмдэглэх: ${item.content.subject}`}
              />
              <div
                className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
              >
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="font-semibold text-sm truncate text-white">
                    {item.content.from}
                  </div>
                  <span className="text-[0.65rem] text-muted-foreground shrink-0">
                    Одоо
                  </span>
                </div>
                <div className="font-medium text-sm truncate text-white/90">
                  {item.content.subject}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.content.body}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-muted-foreground">
          <span className="font-mono font-bold text-white">
            {selected.size}
          </span>{" "}
          / {batch.items.length} тэмдэглэсэн
        </div>
        <button
          onClick={() => onSubmit([...selected])}
          className="rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-red-700 hover:to-rose-700 transition shadow-[0_4px_12px_rgba(239,68,68,0.35)]"
        >
          🚩 Спамд мэдэгдэх
        </button>
      </div>
    </div>
  );
}
