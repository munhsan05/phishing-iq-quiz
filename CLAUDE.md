# Phishing IQ Quiz — diploma_project

Дипломын ажлын практик хэсэг. Email-classification phishing awareness web app.

**Parent workspace**: `/media/munkhsan/Data/diplma_main` — Root `CLAUDE.md`-г эхлээд унш.
**GitHub repo**: `github.com/munhsan05/phishing-iq-quiz` (standalone, Phase G-д link хийгдэнэ)
**Vercel project**: `phishing-iq-quiz` (production, Phase G-д link хийгдэнэ)

## Тойм

- **Name**: "Фишинг IQ тест"
- **Төрөл**: Email classification game — хэрэглэгч имэйл харж **Фишинг уу, Жинхэнэ юу?** гэж шийднэ
- **Stack**: Next.js 16 App Router + React 19 + TypeScript 5 + Drizzle ORM + Neon Postgres + Tailwind CSS v4 + shadcn/ui v4.2 (`base-nova` preset, `@base-ui/react`)
- **Runtime**: Vercel Fluid Compute (Node.js 24)
- **Database**: Neon Postgres (ap-southeast-1), 4 table: `users`, `questions`, `tests`, `answers`
- **Content**: 41 seeded email (10/15/16 per age group), Монгол хэлээр
- **Flow**: Нэр → насны бүлэг (6-18/18-35/35-60+) → 20 сек timer email card quiz → Үр дүн + Leaderboard + confetti

## Файлуудын бүтэц (бодит)

```
diploma_project/
├── .env                       # DATABASE_URL (Neon, gitignored)
├── package.json               # next 16 / react 19 / drizzle 0.45 / neon 1 / shadcn 4.2
├── next.config.ts
├── drizzle.config.ts          # schema: ./src/db/schema.ts, out: ./drizzle
├── components.json            # shadcn "base-nova" preset
├── CLAUDE.md                  # Энэ файл
├── tsconfig.json / eslint.config.mjs / postcss.config.mjs
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # lang="mn", CanvasBackground, Sonner Toaster
│   │   ├── page.tsx                         # Home (нэр + насны сонголт, client)
│   │   ├── globals.css                      # Tailwind v4 @theme — navy/cyan палитр
│   │   ├── actions/quiz.ts                  # Server Actions (startQuiz, submitAnswer, finishQuiz)
│   │   ├── quiz/[testId]/page.tsx           # Quiz runner wrapper (client, sessionStorage)
│   │   ├── result/[testId]/page.tsx         # Server comp: per-question review + confetti
│   │   └── leaderboard/page.tsx             # Server comp: top 20 + podium, ISR 60s
│   │
│   ├── components/
│   │   ├── ui/                              # shadcn primitives (@base-ui/react)
│   │   ├── canvas-background.tsx            # 40-node constellation
│   │   ├── age-group-selector.tsx           # 3 card grid
│   │   ├── question-timer.tsx               # 20-sec countdown + color shift
│   │   ├── quiz-runner.tsx                  # Email card + 2 buttons + feedback modal
│   │   ├── confetti.tsx                     # Canvas confetti (imperative + declarative)
│   │   └── confetti-launcher.tsx            # Client wrapper for server result page
│   │
│   ├── db/
│   │   ├── schema.ts                        # Drizzle tables — EMAIL-CARD schema
│   │   ├── index.ts                         # Neon HTTP + Drizzle client
│   │   ├── queries.ts                       # upsertUser, getQuestionsByAgeGroup, ...
│   │   ├── seed.ts                          # 41 email questions ported from legacy
│   │   └── migrate.ts                       # Custom SQL apply (drizzle-kit push needs TTY)
│   │
│   └── lib/
│       ├── constants.ts                     # AGE_GROUPS, QUIZ_TIME_PER_QUESTION_SEC, counts
│       ├── types.ts                         # ClientQuestion (answer-stripped), QuizSession
│       ├── user-id.ts                       # localStorage UUID (client only)
│       └── utils.ts                         # shadcn cn()
│
├── drizzle/                   # Generated migrations (committed)
│   ├── 0000_*.sql
│   └── meta/
└── public/                    # Static assets
```

## Architecture decisions

- **Email-card schema, NOT multiple-choice**: `questions` хүснэгт `email_from`, `email_subject`, `email_body`, `email_url` (nullable), `is_phish` (boolean) баганатай. Хэрэглэгч зөвхөн 2 сонголт: **Фишинг / Жинхэнэ**. Эхний plan 4-сонголттой multiple-choice гэж таамагласан боловч legacy `script.js` email classification game байсан тул 2026-04-09-д schema revision хийсэн. Memory: `project_phishing_quiz_schema.md`.
- **Framework**: Next.js 16 App Router. Server Actions first-class, REST API route хэрэглэхгүй.
- **DB access**: All SQL goes through `src/db/queries.ts` — page/component-аас шууд `db.select()` дуудахгүй.
- **UI**: Server Components by default. `"use client"` зөвхөн interactivity (home form, quiz runner, timer, canvas, confetti-launcher) хэрэгтэй үед.
- **Answer leakage protection**: `ClientQuestion = Pick<Question, ...>` нь `isPhish`/`explanation`/`recommendation`-г серer serialize хийдэггүй. `toClientQuestion` projection-ыг `startQuiz` action дотор хэрэглэнэ. Correct answer нь зөвхөн `submitAnswer` post-response-д л илчлэгдэнэ.
- **Anonymous auth**: `localStorage` дахь UUID (`src/lib/user-id.ts`). Login байхгүй.
- **Theme**: Tailwind v4 `@theme` блок — navy/cyan/blue-glow палитр. shadcn token-ууд `oklch`-ээр navy дээр mapped.
- **Mongolian UI**: Бүх user-facing string Монгол хэлээр. `<html lang="mn">`. Sora + JetBrains Mono via `next/font/google`.
- **shadcn is v4.2 `base-nova`**: `@base-ui/react` primitives ашигладаг (Radix биш). `<Button asChild>` ажилладаггүй — `<Link className={cn(buttonVariants({...}))}>` pattern хэрэглэ.
- **drizzle-kit push needs TTY**: Agent shell-д ажиллахгүй. `src/db/migrate.ts` custom script ашиглаж generate SQL-ийг Neon HTTP driver-ээр direct apply хийнэ.
- **Score bands (result page)**: 100% = "Гайхалтай!", 90%+ = "Шилдэг", 70%+ = "Сайн", 50%+ = "Дундаж", <50% = "Анхан шат". Хамгийн эх үндсэн эх — `script.js`.

## Commands

### Local development
```bash
npm install
npm run dev                    # Next.js dev server (port 3000)
npm run build                  # Production build — typecheck + bundle
npm run lint                   # ESLint
```

### Database
```bash
npm run db:generate            # Generate SQL migration from schema changes
npx tsx src/db/migrate.ts      # Apply drizzle/*.sql to Neon (preferred in agent shells)
npm run db:push                # drizzle-kit push — зөвхөн хэрэглэгчийн terminal-д (TTY хэрэгтэй)
npm run db:studio              # Drizzle Studio UI
npm run seed                   # Re-seed: truncate questions, insert 41 rows from src/db/seed.ts
```

### Vercel (Phase G-д link хийсний дараа)
```bash
vercel link                    # Link local dir to Vercel project
vercel env pull                # Sync env vars from Vercel to .env.local
vercel deploy                  # Preview deploy
vercel deploy --prod           # Production deploy
vercel logs <deployment>       # Inspect logs
```

## Гол ажлын газар

| Юу өөрчлөх | Файл | Тайлбар |
|---|---|---|
| Шинэ имэйл нэмэх | `src/db/seed.ts` → `npm run seed` | `NewQuestion` type, orderIndex unique per age |
| Quiz logic | `src/components/quiz-runner.tsx` | Keyboard: P=Фишинг, L=Жинхэнэ, Enter=Next |
| Server Actions | `src/app/actions/quiz.ts` | startQuiz / submitAnswer / finishQuiz |
| Schema өөрчлөлт | `src/db/schema.ts` → `npm run db:generate` → `npx tsx src/db/migrate.ts` | |
| Theme/color | `src/app/globals.css` `@theme` block | |
| Timer хугацаа | `src/lib/constants.ts` `QUIZ_TIME_PER_QUESTION_SEC` | |
| Canvas animation | `src/components/canvas-background.tsx` | `prefers-reduced-motion` fallback |
| Score band thresholds | `src/app/result/[testId]/page.tsx` | 100% / 90% / 70% / 50% |

## Кодонд ажиллах дүрэм

1. **Server Actions first** — REST API route зөвхөн external integration-д.
2. **DB access зөвхөн `src/db/`** — page/component-аас шууд `db.select()` дуудахгүй.
3. **Server Components default** — `"use client"` interactivity-д л.
4. **Answer leak-ийг хориглох**: `isPhish`/`explanation`/`recommendation`-г client payload-д хэзээ ч оруулахгүй. `startQuiz` буцаах үед `toClientQuestion` projection хэрэглэ. Correct answer нь зөвхөн `submitAnswer` response-д л илрэнэ.
5. **Type-safe schema** — `src/db/schema.ts`-аас `Question`/`NewQuestion`/`$inferSelect`/`$inferInsert` ашиглана.
6. **Монгол UI** — шинэ string бүгд Монгол хэлээр. Legacy copy-г **яг тэр хэвээр нь** хуулна, дахин бичихгүй.
7. **Drizzle migration workflow** — schema засвар бүрийн дараа `npm run db:generate`, generated SQL-ийг git-д commit хийнэ.
8. **shadcn components** — `npx shadcn@latest add <component>` суулгана. `asChild` ажилладаггүй — `<Link className={cn(buttonVariants(...))}>` pattern.
9. **Vercel CLI** — local test-д `vercel env pull` ашигла.
10. **Context7 MCP** — Drizzle/Next.js/Neon/shadcn API-д training data-д итгэхгүй, `mcp__context7__resolve-library-id` → `query-docs` ашиглан официал документаас шалгана.
11. **`npm run dev`-г agent background shell-д битгий ажиллуул** — hang хийнэ. Хэрэглэгчийн terminal-д л эхлүүлэх.

## Known limitations / TODO

- [ ] Pre/post test comparison UI — schema бэлэн (`tests.test_type`, `experiment_id`), UI хэрэгтэй
- [ ] Multi-user analytics dashboard — `/admin/analytics` route үүсгэх
- [ ] AI-generated personalized recommendations — Vercel AI Gateway integration
- [ ] Mobile portrait layout polish
- [ ] Accessibility audit (keyboard nav + color contrast)
- [ ] Deterministic shuffle per experiment_id (одоо `crypto.getRandomValues` Fisher-Yates)
- [ ] Resume code feature (UUID + 6-digit code)

## Diploma thesis холбоо

Энэ app нь `diploma-thesis/Chapters/Chapter3.tex`-д гол үүрэгтэй:
- **3.1** — Email-classification quiz-based intervention архитектур
- **3.2** — Туршилтын аргачлал (pre/post test design + practice mode)
- **3.3** — Статистик шинжилгээ (Drizzle queries-ийг dashboard-руу хөрвүүлнэ)

**Data flow**: Pre-test → quiz интервэнц → post-test, бүгд DB-д (`tests.test_type`) хадгалагдана. Paired t-test нь Chapter 3.3.2-т. `experiment_id` багана нь bucket-тэй туршилтуудыг ялгахад.

## Агент дээр ажиллах зөвлөмж

- Том өөрчлөлтөд `superpowers:brainstorming` → `writing-plans` → `subagent-driven-development` skill chain
- Drizzle/Next.js/Neon/shadcn API-д memory-д итгэхгүй: `context7` MCP ашиглана
- DB schema өөрчлөвөл generated migration файлыг git-д commit хийнэ
- Vercel деплойлохын өмнө `npm run build` амжилттай байх ёстой
- Browser-д test: хэрэглэгчийн terminal-д `npm run dev` (agent background shell-д hang)
- Typecheck: `npx tsc --noEmit`
- Schema revision history: `project_phishing_quiz_schema.md` memory-г нэг бүр унш
