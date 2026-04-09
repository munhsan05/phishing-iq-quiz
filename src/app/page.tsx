import { CanvasBg } from "@/components/canvas-bg";

export default function Home() {
  return (
    <>
      <CanvasBg />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <h1 className="font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Фишинг <span className="text-cyan">IQ</span> тест
          </h1>
          <p className="mt-4 text-lg text-text-2">
            Монгол хэрэглэгчдийн фишинг имэйл илрүүлэх чадварыг шалгах
            интерактив тест
          </p>
        </div>
      </main>
    </>
  );
}
