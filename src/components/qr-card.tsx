"use client";

import { useState } from "react";
import Image from "next/image";
import type { QrContent } from "@/lib/types";

export function QrCard({ content }: { content: QrContent }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg overflow-hidden border border-border bg-card">
        <Image
          src={content.posterImagePath}
          alt={content.contextDescription}
          width={400}
          height={300}
          className="w-full h-auto"
          priority
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{content.contextDescription}</p>
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="mt-4 w-full rounded-md border border-border bg-secondary px-4 py-3 text-sm font-medium hover:bg-secondary/80 transition"
      >
        {revealed ? "URL-г нуух" : "QR кодыг уншиж үзэх"}
      </button>
      {revealed && (
        <div className="mt-3 rounded-md border border-primary/50 bg-primary/10 p-3 font-mono text-xs break-all">
          {content.qrUrl}
        </div>
      )}
    </div>
  );
}
