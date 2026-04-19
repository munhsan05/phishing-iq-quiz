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
    <div className="mx-auto max-w-3xl">
      {batch.context && (
        <p className="mb-4 text-sm text-muted-foreground italic">
          💡 {batch.context}
        </p>
      )}
      <div className="rounded-lg border border-border divide-y divide-border bg-card">
        {batch.items.map((item) => {
          const isSel = selected.has(item.id);
          return (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-4 cursor-pointer transition ${
                isSel
                  ? "bg-red-900/20 border-l-4 border-l-red-500"
                  : "hover:bg-secondary/50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => toggle(item.id)}
                className="mt-1 h-4 w-4"
                aria-label={`Фишинг гэж тэмдэглэх: ${item.content.subject}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="font-semibold text-sm truncate">{item.content.from}</div>
                </div>
                <div className="font-medium text-sm truncate">{item.content.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.content.body}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selected.size} / {batch.items.length} тэмдэглэсэн
        </div>
        <button
          onClick={() => onSubmit([...selected])}
          className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
        >
          🚩 Спамд мэдэгдэх
        </button>
      </div>
    </div>
  );
}
