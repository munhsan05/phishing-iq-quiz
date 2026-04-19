"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { QrContent } from "@/lib/types";

const SCENARIO_THEMES: Record<
  string,
  { bg: string; accent: string; emoji: string; title: string; subtitle: string }
> = {
  wifi_poster: { bg: "bg-gradient-to-br from-sky-700 to-cyan-900", accent: "text-sky-300", emoji: "📶", title: "Free WiFi", subtitle: "Холбогдохын тулд QR-г уншуулна уу" },
  school_canteen: { bg: "bg-gradient-to-br from-orange-700 to-amber-900", accent: "text-amber-300", emoji: "🍽️", title: "Сургуулийн хоолны цэс", subtitle: "Өнөөдрийн цэс — QR" },
  music_bonus: { bg: "bg-gradient-to-br from-purple-700 to-fuchsia-900", accent: "text-fuchsia-300", emoji: "🎵", title: "Spotify Premium", subtitle: "3 сар үнэгүй! Scan хийнэ үү" },
  restaurant_menu: { bg: "bg-gradient-to-br from-rose-700 to-red-900", accent: "text-rose-300", emoji: "🍔", title: "Khan Burger", subtitle: "Цэс үзэх + захиалах" },
  crypto_airdrop: { bg: "bg-gradient-to-br from-yellow-600 to-orange-800", accent: "text-yellow-300", emoji: "₿", title: "Free Bitcoin", subtitle: "0.01 BTC үнэгүй авах" },
  parking_fee: { bg: "bg-gradient-to-br from-slate-700 to-zinc-900", accent: "text-slate-300", emoji: "🅿️", title: "Зогсоолын төлбөр", subtitle: "Улаанбаатар нийслэл" },
  banking_transfer: { bg: "bg-gradient-to-br from-emerald-700 to-green-900", accent: "text-emerald-300", emoji: "🏦", title: "Хандивын данс", subtitle: "QR-аар шилжүүлэх" },
  govt_service: { bg: "bg-gradient-to-br from-blue-700 to-indigo-900", accent: "text-blue-300", emoji: "🇲🇳", title: "e-Mongolia үйлчилгээ", subtitle: "Эрүүл мэнд бүртгэл" },
  bus_stop: { bg: "bg-gradient-to-br from-teal-700 to-cyan-900", accent: "text-teal-300", emoji: "🚌", title: "Автобусны буудал", subtitle: "Хуваарь үзэх — QR" },
};

export function QrCard({ content }: { content: QrContent }) {
  const [revealed, setRevealed] = useState(false);
  const theme =
    SCENARIO_THEMES[content.scenario] ?? {
      bg: "bg-gradient-to-br from-neutral-700 to-neutral-900",
      accent: "text-neutral-300",
      emoji: "📸",
      title: content.scenario,
      subtitle: "QR кодыг үзнэ үү",
    };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className={`rounded-2xl overflow-hidden border border-border shadow-2xl ${theme.bg} relative`}
      >
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="text-7xl mb-3">{theme.emoji}</div>
          <h3 className="text-3xl font-bold text-white">{theme.title}</h3>
          <p className={`text-base mt-2 ${theme.accent}`}>{theme.subtitle}</p>
        </div>
        <div className="flex justify-center pb-8">
          <div className="rounded-xl bg-white p-5 shadow-xl">
            <QRCodeSVG
              value={content.qrUrl}
              size={260}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              marginSize={1}
            />
          </div>
        </div>
        <div className="bg-black/30 px-4 py-3 text-center text-sm text-white/90">
          📱 Гар утсаараа scan хийнэ үү
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-center italic">
        💭 {content.contextDescription}
      </p>
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="mt-4 w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm font-medium hover:bg-secondary/80 transition flex items-center justify-center gap-2"
      >
        {revealed ? (
          <>
            <span>🙈</span> URL-г нуух
          </>
        ) : (
          <>
            <span>🔍</span> QR кодыг scan хийсэн бол URL харах
          </>
        )}
      </button>
      {revealed && (
        <div className="mt-3 rounded-md border border-amber-500/50 bg-amber-500/10 p-3">
          <div className="text-xs uppercase tracking-wider text-amber-300 mb-1">
            QR scan үр дүн:
          </div>
          <div className="font-mono text-xs break-all text-white">
            {content.qrUrl}
          </div>
        </div>
      )}
    </div>
  );
}
