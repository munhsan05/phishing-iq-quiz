"use client";

import { useState } from "react";
import type { BrowserContent } from "@/lib/types";

function isHttps(url: string) {
  return url.startsWith("https://");
}

export function BrowserWarning({ content }: { content: BrowserContent }) {
  const [dismissed, setDismissed] = useState(!content.warningTriggered);
  const secure = isHttps(content.browserUrl);

  return (
    <div className="mx-auto max-w-3xl rounded-xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-900">
      <div className="bg-neutral-800 px-3 py-2 flex items-center gap-2 border-b border-neutral-700">
        <div className="flex gap-1.5 mr-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <button className="text-neutral-400 text-lg">‹</button>
        <button className="text-neutral-400 text-lg">›</button>
        <button className="text-neutral-400 text-base">↻</button>
        <div className="flex-1 mx-2 rounded-full bg-neutral-700 px-3 py-1.5 flex items-center gap-2">
          <span
            className={`text-xs ${secure ? "text-green-400" : "text-amber-400"}`}
            aria-hidden="true"
          >
            {secure ? "🔒" : "⚠️"}
          </span>
          <span className="font-mono text-xs text-neutral-200 truncate flex-1">
            {content.browserUrl}
          </span>
          <button className="text-neutral-400 text-xs">⋮</button>
        </div>
        <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
          О
        </div>
      </div>

      <div className="bg-neutral-100 px-3 py-1 flex items-center gap-2 border-b border-neutral-300">
        <span className="text-xs text-neutral-600">⭐ Bookmarks</span>
        <span className="text-xs text-neutral-400">|</span>
        <span className="text-xs text-neutral-500 truncate">{content.pageTitle}</span>
      </div>

      <div className="relative bg-white p-8 min-h-[300px]">
        <h2 className="text-2xl font-bold text-neutral-900">{content.pageTitle}</h2>
        <p className="mt-2 text-neutral-500">Хуудсыг ачаалж байна...</p>
        <div className="mt-6 space-y-2">
          <div className="h-3 w-3/4 bg-neutral-200 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-neutral-200 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-neutral-200 rounded animate-pulse" />
        </div>

        {!dismissed && content.warningTriggered && (
          <div className="absolute inset-0 bg-red-950/95 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="max-w-md rounded-lg border-2 border-red-500 bg-gradient-to-b from-red-900 to-red-950 p-6 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">⚠️</div>
                <div>
                  <div className="font-bold text-lg leading-tight">
                    Анхаар!
                  </div>
                  <div className="text-sm text-red-200">
                    Энэ сайт аюултай байж магадгүй
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Энэ хаягаас фишингийн сайт эсвэл хортой программ илрүүлсэн
                гэсэн аюулын шинж тэмдэг бүртгэгдсэн. Аюулгүй байдлын үүднээс
                энэ хуудаснаас буцахыг зөвлөж байна.
              </p>
              <div className="mt-3 rounded bg-red-950/60 px-3 py-2 font-mono text-xs break-all text-red-200 border border-red-800/50">
                {content.browserUrl}
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="mt-4 text-xs underline text-red-200 hover:text-white"
              >
                Анхааруулгыг хаах →
              </button>
            </div>
          </div>
        )}
      </div>

      {content.redirectFrom && (
        <div className="bg-neutral-100 text-neutral-600 px-4 py-1.5 text-xs border-t border-neutral-300">
          🔀 Шилжүүлсэн:{" "}
          <span className="font-mono">{content.redirectFrom}</span>
        </div>
      )}
    </div>
  );
}
