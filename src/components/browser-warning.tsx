"use client";

import { useState } from "react";
import type { BrowserContent } from "@/lib/types";

export function BrowserWarning({ content }: { content: BrowserContent }) {
  const [dismissed, setDismissed] = useState(!content.warningTriggered);
  return (
    <div className="mx-auto max-w-3xl rounded-lg overflow-hidden border-2 border-border shadow-2xl">
      <div className="bg-neutral-800 px-3 py-2 flex items-center gap-2 border-b border-neutral-700">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 mx-3 rounded-full bg-neutral-700 px-3 py-1.5 font-mono text-xs text-neutral-200 truncate">
          {content.browserUrl}
        </div>
      </div>
      <div className="relative bg-white p-8 min-h-[240px]">
        <h2 className="text-2xl font-bold text-neutral-900">{content.pageTitle}</h2>
        <p className="mt-2 text-neutral-500">Энэ хуудас нээгдэх гэж байна...</p>
        {!dismissed && content.warningTriggered && (
          <div className="absolute inset-0 bg-red-950/95 flex items-center justify-center p-6">
            <div className="max-w-md rounded-lg border-2 border-red-500 bg-red-900 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">⚠️</div>
                <div className="font-bold text-lg">Анхаар! Энэ сайт аюултай байж магадгүй</div>
              </div>
              <p className="text-sm opacity-90">
                Энэ хаягаас фишингийн сайт эсвэл хортой программ байгаа гэсэн
                аюулын шинж тэмдэг илэрсэн.
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="mt-4 text-xs underline text-red-200 hover:text-white"
              >
                Анхааруулгыг хаах
              </button>
            </div>
          </div>
        )}
      </div>
      {content.redirectFrom && (
        <div className="bg-neutral-100 text-neutral-600 px-3 py-1 text-xs">
          Шилжүүлсэн: <span className="font-mono">{content.redirectFrom}</span>
        </div>
      )}
    </div>
  );
}
