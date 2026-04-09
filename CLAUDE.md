# Phishing IQ Quiz — diploma_project

Дипломын ажлын практик хэсэг. Phishing awareness quiz web app.

**Parent workspace**: `/media/munkhsan/Data/diplma_main` — Root `CLAUDE.md`-г эхлээд унш.

## Тойм

- **Name**: "Фишинг тест" (Phishing IQ Quiz)
- **Stack**: Vanilla HTML/CSS/JS + Firebase Firestore + Firebase Cloud Functions + Firebase Hosting
- **Firebase project**: `diplom-7ee78`
- **Flow**: Нэр оруулах → Насны бүлэг сонгох (6-18 / 18-35 / 35-60+) → 20 сек timer quiz → Үр дүн + Leaderboard + confetti

## Файлуудын бүтэц

```
diploma_project/
├── index.html          # Main UI (2156 мөр) - inline CSS, Монгол хэл
├── script.js           # Quiz logic (1447 мөр) - canvas anim, timer, scoring
├── firebase.js         # Firestore CRUD (160 мөр) - saveScore, getLeaderboard, fallback localStorage
├── firebase.json       # Hosting + Firestore config
├── .firebaserc         # Project alias
├── firestore.rules     # Security rules (test mode хүртэл 2026-05-02)
├── firestore.indexes.json  # Composite index (score desc, time asc)
├── functions/          # Cloud Functions source
│   ├── src/index.ts
│   ├── package.json, tsconfig.json, .eslintrc.js
├── public/             # Firebase Hosting target
├── package.json        # Only firebase dependency
└── .gitignore
```

Root git repo энэ бүх файлыг tracking хийнэ (diploma_project дотор тусдаа .git байхгүй).

## Architecture decisions

- **Build tool байхгүй**: webpack, vite зэрэг хэрэглэхгүй. Simple static files.
- **ES modules**: `firebase.js` нь ES module. `index.html`-д `<script type="module" src="firebase.js"></script>`.
- **localStorage fallback**: `firebase.js`-д `saveToLeaderboardLocal` нөөц буцаа хэлбэр (Firebase ажиллахгүй үед).
- **Canvas background animation**: `script.js`-ийн `bg-canvas` хэсэг — 40 node, connecting lines.
- **Inline CSS**: `index.html`-д CSS variables (`:root { --navy, --blue, --cyan, ...}`) ашиглана. Tailwind биш.

## Ажлын workflow

### Local preview
```bash
firebase serve --only hosting

# Эсвэл python:
python3 -m http.server 8000
```

### Deploy
```bash
firebase deploy                             # Бүгдийг
firebase deploy --only hosting              # Зөвхөн website
firebase deploy --only firestore            # Зөвхөн rules/indexes
firebase deploy --only functions            # Cloud Functions
```

### Firestore rules test
```bash
firebase emulators:start --only firestore
```

## Гол ажлын газар

| Юу өөрчлөх | Файл | Хаана |
|---|---|---|
| Quiz асуултууд | `script.js` | `QUESTIONS` объект дотор (3 насны бүлэгт) |
| Leaderboard logic | `firebase.js` | `saveScoreOnline`, `getLeaderboardOnline` |
| Timer duration | `script.js` | `QUESTION_TIME` constant |
| UI цвет, стиль | `index.html` | `<style>` block, `:root` CSS variables |
| Background animation | `script.js` | `bg-canvas` section, `NODE_COUNT` |
| Confetti | `script.js` | `triggerConfetti()` function |

## Кодонд ажиллах дүрэм

1. **Vanilla JS хэвээр үлдээх** — build tool, bundler, фреймворк нэмэхгүй.
2. **ES modules**: `firebase.js`-ээс `export`-той функц авах тохиолдолд `import` ашиглана.
3. **Firestore rules** — одоогоор test mode (2026-05-02 хүртэл бүх хэрэглэгч access-тэй). **MUST-FIX** production-д. Зөвлөмжтэй rules:
   ```javascript
   match /leaderboard/{docId} {
     allow read: if true;
     allow create: if request.resource.data.score is number
                   && request.resource.data.name is string
                   && request.resource.data.name.size() < 50;
     allow update, delete: if false;  // Only via admin
   }
   ```
4. **localStorage fallback**: Шинэ feature нэмэхэд **үргэлж** fallback замыг баталгаажуулах.
5. **Монгол хэлээр UI**: `<html lang="mn">` тогтмол байх. Шинэ текст нэмэхдээ Монгол хэлээр.
6. **Firebase SDK 12+**: `context7` MCP-аас API-г тодруулна (memory-д итгэхгүй): `mcp__context7__resolve-library-id` with `firebase/js`.
7. **Quiz асуултын quality**: Realistic, Монгол орчны онцлогтой (Khan Bank, Голомт, e-Mongolia зэрэг нэрс). Хуурамч вэб URL нь жинхэнэтэй ойролцоо (e.g., `khanbank-mn.com`).

## Known issues / TODO

- [ ] Firestore rules production хөрвөх — хугацаа дуусах 2026-05-02
- [ ] Leaderboard pagination (одоо max 20 entry)
- [ ] Quiz асуултын набор нэмэх (18-35 насны бүлэгт илүү сонголт)
- [ ] Pre-test / Post-test modes (Chapter 3 experimentation-д зориулсан)
- [ ] Analytics event tracking (Chapter 3 data collection-д)
- [ ] Mobile portrait layout improvements
- [ ] Accessibility (a11y): color contrast, keyboard nav

## Diploma thesis холбоо

Энэ app нь `diploma-thesis/Chapters/Chapter3.tex`-д гол үүрэгтэй:
- **3.1** — Quiz-based intervention model-ийн архитектур (энэ app-ын архитектур)
- **3.2** — Туршилтын аргачлал (pre-test → quiz → post-test)
- **3.3** — Статистик шинжилгээ (quiz data)

**Data flow**: Quiz оролцогчид pre-test → quiz интервэнц (энэ app) → post-test. Firestore leaderboard нь нэмэлт motivation элемент. Pre/post score-ийг статистикаар харьцуулна (paired t-test, Chapter 3.3.2).

## Агент дээр ажиллах зөвлөмж

- **Root CLAUDE.md-ийн "Үргэлж ашиглах MCP"**-ийг мөрдөнө
- Том өөрчлөлт эсвэл шинэ feature эхлэхэд `brainstorming` skill эхлээд дуудах
- `context7` MCP-аар Firebase API-г үргэлж шалгах
- Quiz content өөрчлөхдөө `script.js`-ийн `QUESTIONS` объектыг Read эхлээд
- Test хийхэд `puppeteer` MCP ашиглах боломжтой (UI automation)
