import { SafetyTipsGrid } from "@/components/safety-tips-grid";

export const metadata = {
  title: "Зөвлөмж",
};

export default function TipsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          💡 Фишингээс хамгаалах зөвлөмж
        </h1>
        <p className="text-base text-slate-600">
          Өдөр тутамд кибер аюулгүй байдлаа сахихын тулд эдгээр зарчмыг
          мөрдөөрэй.
        </p>
      </header>

      <SafetyTipsGrid />
    </div>
  );
}
