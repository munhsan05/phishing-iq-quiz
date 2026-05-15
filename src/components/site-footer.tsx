import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">Фишинг IQ тест</p>
            <p className="text-xs">
              Бакалаврын дипломын ажлын хэрэгжүүлэлт · ШУТИС МХТС, Кибер
              аюулгүй байдлын тэнхим
            </p>
          </div>
          <div className="space-y-1 text-xs">
            <p>
              <span className="text-slate-500">Зохиогч:</span>{" "}
              <span className="text-slate-900">П.Мөнхсан</span> (B221870100)
            </p>
            <p>
              <span className="text-slate-500">Удирдагч:</span>{" "}
              <span className="text-slate-900">Н.Даваасүрэн (Ph.D)</span>
            </p>
            <p>
              <span className="text-slate-500">Хамгаалалт:</span> V.2026
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 П.Мөнхсан. Боловсролын зориулалттай.</p>
          <p>
            <Link href="/" className="hover:text-slate-900">
              Гэр буцах
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
