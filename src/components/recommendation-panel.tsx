import {
  Search,
  Lock,
  AlertTriangle,
  Paperclip,
  PhoneCall,
  KeyRound,
  RotateCcw,
} from "lucide-react";

type Tip = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const TIPS: Tip[] = [
  {
    icon: Search,
    title: "URL-ыг хуулж байж шалгах",
    body: "Линкийг шууд дарахын оронд хаягаа хуулж text editor-т харж шалгаарай.",
  },
  {
    icon: Lock,
    title: "2FA асаах",
    body: "Боломжтой бүх данс дээр 2 шатлалт баталгаажуулалтыг идэвхжүүлээрэй.",
  },
  {
    icon: AlertTriangle,
    title: "Яаралтай дарамтлалд автахгүй",
    body: '"Яаралтай!", "Цаг хугацаа дуусч байна" гэх мэт дарамтыг анхааруулга гэж ойлгоорой.',
  },
  {
    icon: Paperclip,
    title: "Сэжигтэй хавсралт өл нээх",
    body: ".exe, .zip, .docm зэрэг хавсралтыг танихгүй илгээгчээс ирвэл нээхгүй.",
  },
  {
    icon: PhoneCall,
    title: "Илгээгчийг эх эхэнээс баталгаажуулах",
    body: "Банк, ажлын газраас ирсэн санагдсан имэйлийг албан утсаар буцаан баталгаажуулна.",
  },
  {
    icon: KeyRound,
    title: "Нууц үгээ ил оруулахгүй",
    body: "Имэйл линкээр орсон хуудсанд нууц үг оруулахаас өмнө URL-ийг 2 дахин шалгана.",
  },
  {
    icon: RotateCcw,
    title: "Нууц үгээ тогтмол солих",
    body: "3-6 сар тутамд гол данснуудын нууц үгийг шинэчилж, дахин хэрэглэхгүй.",
  },
];

export function RecommendationPanel() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900">
        💡 Фишингээс хамгаалах зөвлөмжүүд
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <Icon className="mb-2 h-5 w-5 text-cyan-600" aria-hidden />
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                {tip.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">{tip.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
