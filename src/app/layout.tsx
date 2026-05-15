import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CanvasBackground } from "@/components/canvas-background";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

// Sora — primary UI font, matches legacy index.html.
// Mapped to --font-sans so shadcn/ui components inherit it.
const sora = Roboto({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
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
  metadataBase: new URL("https://phishing-iq-quiz.vercel.app"),
  title: {
    default: "Фишинг IQ тест",
    template: "%s · Фишинг IQ тест",
  },
  description:
    "Монгол хэлээр зориулсан фишинг таних чадварын тест болон AI имэйл шалгах хэрэгсэл. Бакалаврын дипломын ажил.",
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
    title: "Фишинг IQ тест",
    description:
      "Монгол хэрэглэгчдийн фишинг таних чадварыг үнэлэх 41 асуулттай тест + AI имэйл шалгах.",
    type: "website",
    locale: "mn_MN",
    siteName: "Фишинг IQ тест",
  },
  twitter: {
    card: "summary_large_image",
    title: "Фишинг IQ тест",
    description: "Фишинг таних чадварын тест болон AI имэйл шалгах.",
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
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
