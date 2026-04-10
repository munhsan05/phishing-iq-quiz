import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CanvasBackground } from "@/components/canvas-background";
import { Toaster } from "@/components/ui/sonner";

// Sora — primary UI font, matches legacy index.html.
// Mapped to --font-sans so shadcn/ui components inherit it.
const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// JetBrains Mono — used in legacy for age range, timer, numbers.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phishing-iq.vercel.app"),
  title: {
    default: "Фишинг IQ тест",
    template: "%s · Фишинг IQ тест",
  },
  description:
    "Монгол хэрэглэгчдийн фишинг имэйл илрүүлэх чадварыг шалгах интерактив тест. ШУТИС — Кибер аюулгүй байдлын тэнхим.",
  applicationName: "Фишинг IQ тест",
  authors: [{ name: "П.Мөнхсан" }],
  keywords: [
    "фишинг",
    "phishing",
    "кибер аюулгүй байдал",
    "cyber security",
    "IQ тест",
    "Mongolia",
    "ШУТИС",
  ],
  openGraph: {
    type: "website",
    locale: "mn_MN",
    title: "Фишинг IQ тест",
    description:
      "Жинхэнэ имэйл болон фишинг халдлагыг ялган таних чадвараа шалгаарай.",
    siteName: "Фишинг IQ тест",
  },
  twitter: {
    card: "summary_large_image",
    title: "Фишинг IQ тест",
    description:
      "Жинхэнэ имэйл болон фишинг халдлагыг ялган таних чадвараа шалгаарай.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mn"
      className={`${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          Агуулга руу алгасах
        </a>
        <CanvasBackground />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
