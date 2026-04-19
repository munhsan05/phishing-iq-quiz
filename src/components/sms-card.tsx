"use client";

import type { SmsContent } from "@/lib/types";

export function SmsCard({ content }: { content: SmsContent }) {
  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-neutral-900 p-6 shadow-2xl border border-neutral-800">
      <div className="flex items-center gap-2 pb-4 border-b border-neutral-700">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
          {content.sender.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-white">{content.sender}</div>
          <div className="text-xs text-neutral-400">Messages</div>
        </div>
      </div>
      <div className="py-4 space-y-2">
        <div className="bg-neutral-800 text-white rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%]">
          {content.body.split(/(https?:\/\/\S+)/g).map((part, i) =>
            part.match(/^https?:\/\//) ? (
              <span key={i} className="text-sky-400 underline">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </div>
        <div className="text-xs text-neutral-500 pl-2">Одоо</div>
      </div>
    </div>
  );
}
