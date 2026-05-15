import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AIEmailCheckForm } from "@/components/ai-email-check-form";

export const metadata = {
  title: "AI имэйл шалгах · Фишинг IQ тест",
};

export default function CheckPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Нүүр хуудас
      </Link>

      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">🤖 AI имэйл шалгах</h1>
        <p className="text-sm text-slate-600">
          Сэжигтэй имэйл ирсэн үү? Доорх талбарт хуулж буулгаад "Шалгах" дарна
          уу. AI тус имэйл фишинг эсэхийг 1 өгүүлбэрээр үнэлнэ.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <AIEmailCheckForm />
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Хязгаар: өдөрт 10 шалгалт. AI алдаа гаргаж болзошгүй — эцсийн шийдвэр
        Танд.
      </p>
    </main>
  );
}
