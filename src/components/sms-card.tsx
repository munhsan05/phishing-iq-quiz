"use client";

import type { SmsContent } from "@/lib/types";

export function SmsCard({ content }: { content: SmsContent }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[2.5rem] bg-neutral-900 p-2 shadow-2xl border border-neutral-700 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-neutral-900 rounded-b-2xl z-10" />
        <div className="rounded-[2rem] bg-gradient-to-b from-neutral-800 to-neutral-900 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-3 pb-2 text-white text-xs">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-700/50 bg-neutral-800/80 backdrop-blur">
            <button className="text-blue-400 text-2xl leading-none">‹</button>
            <div className="flex-1 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {content.sender.charAt(0).toUpperCase()}
              </div>
              <div className="text-white text-xs mt-1 font-medium">
                {content.sender}
              </div>
            </div>
            <button className="text-blue-400 text-xl">ⓘ</button>
          </div>

          <div className="px-4 py-6 space-y-3 min-h-[300px]">
            <div className="text-center text-xs text-neutral-500">
              Өнөөдөр 9:41
            </div>
            <div className="flex flex-col items-start">
              <div className="bg-neutral-700 text-white rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed max-w-[85%] shadow-md">
                {content.body
                  .split(/(https?:\/\/\S+)/g)
                  .map((part, i) =>
                    part.match(/^https?:\/\//) ? (
                      <span key={i} className="text-sky-400 underline">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 ml-2">Одоо</div>
            </div>
          </div>

          <div className="px-3 py-2 border-t border-neutral-700/50 bg-neutral-800/80 flex items-center gap-2">
            <button className="text-neutral-400 text-xl">📷</button>
            <div className="flex-1 rounded-full bg-neutral-700 px-3 py-1.5 text-xs text-neutral-500">
              Хариу бичих...
            </div>
            <button className="text-blue-400 text-xl">▲</button>
          </div>
        </div>
      </div>
    </div>
  );
}
