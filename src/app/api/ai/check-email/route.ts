import { NextRequest, NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";

import { checkRateLimit } from "@/lib/rate-limit";
import {
  PHISHING_CHECK_SYSTEM_PROMPT,
  VERDICT_MAX_TOKENS,
} from "@/lib/ai-prompt";

const MAX_EMAIL_CHARS = 5000;

const verdictSchema = z.object({
  verdict: z.enum(["phishing", "legitimate", "uncertain"]),
  confidence: z.number().min(0).max(100),
  summary: z.string().max(220),
});

type CheckResponse =
  | (z.infer<typeof verdictSchema> & { remaining: number })
  | { error: string };

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: NextRequest): Promise<NextResponse<CheckResponse>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = z
    .object({ emailText: z.string().min(1).max(MAX_EMAIL_CHARS) })
    .safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "emailText must be 1–5000 characters" },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Өдрийн 10 шалгалт хэрэглэж дууссан байна. Маргааш дахин ирээрэй." },
      { status: 429 }
    );
  }

  try {
    const { experimental_output } = await generateText({
      model: "anthropic/claude-haiku-4.5",
      output: Output.object({ schema: verdictSchema }),
      system: PHISHING_CHECK_SYSTEM_PROMPT,
      prompt: parsed.data.emailText,
      maxOutputTokens: VERDICT_MAX_TOKENS,
      abortSignal: AbortSignal.timeout(15_000),
    });

    return NextResponse.json({
      ...experimental_output,
      remaining: limit.remaining,
    });
  } catch (err) {
    console.error("[check-email] AI error", err);
    return NextResponse.json(
      { error: "AI шалгах боломжгүй боллоо. Хэсэг хүлээгээд дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
