import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AIEmailCheckForm } from "@/components/ai-email-check-form";

export const metadata = {
  title: "AI имэйл шалгах · Фишинг IQ тест",
};

export default function CheckPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Нүүр хуудас
      </Link>

      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-white">🤖 AI имэйл шалгах</h1>
        <p className="text-sm text-white/70">
          Сэжигтэй имэйл ирсэн үү? Доорх талбарт хуулж буулгаад "Шалгах" дарна
          уу. AI тус имэйл фишинг эсэхийг 1 өгүүлбэрээр үнэлнэ.
        </p>
      </header>

      <AIEmailCheckForm />

      <p className="mt-8 text-xs text-white/50">
        Хязгаар: өдөрт 10 шалгалт. AI алдаа гаргаж болзошгүй — эцсийн шийдвэр
        Танд.
      </p>
    </main>
  );
}
