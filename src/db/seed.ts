/**
 * Seed the questions table with 41 hand-crafted email samples.
 *
 * Layout:
 *   - 10 rows for age group 6-18
 *   - 15 rows for age group 18-35
 *   - 16 rows for age group 35-60+
 *
 * Source: ported from legacy `script.js` (`questionsByAge` + `mongolQuestions`).
 * Mongolian text is preserved exactly as authored; HTML tags were stripped from
 * the email bodies and hints, but emojis and line breaks are kept.
 *
 * Run with: npm run seed
 */
import "dotenv/config";
import { db } from "./index";
import { questions, answers, tests, type NewQuestion } from "./schema";

const QUESTIONS: NewQuestion[] = [
  // ============================================
  // Age group: 6-18
  // ============================================
  {
    ageGroup: "6-18",
    orderIndex: 1,
    category: "url_spoofing",
    emailFrom: "Roblox Support <support@roblox-free-robux.com>",
    emailSubject: "🎮 Чөлөөт 10,000 Robux авах боломж!",
    emailBody: `Баяр хүргэе! Та 10,000 Robux-ийн шагнал хожлоо.

Шагналаа авахын тулд Roblox акаунтынхаа нэвтрэх мэдээллийг оруулна уу.

⏰ Зөвхөн 15 минут л хүчинтэй!`,
    emailUrl: "https://roblox-free-robux.com/claim",
    isPhish: true,
    explanation: "🔍 Roblox хэзээ ч \"roblox-free-robux.com\" гэх домэйн ашигладаггүй. Үнэгүй Robux өгнө гэдэг нь бараг үргэлж луйвар! Акаунтын мэдээллээ хэзээ ч бусдад өгч болохгүй.",
    recommendation: "Илгээгч нь roblox-free-robux.com домэйн ашигласан бөгөөд Roblox-ийн жинхэнэ домэйн roblox.com-аас огт ялгаатай — \"үнэгүй Robux\" амласан яаралтай мессеж нь нэвтрэх мэдээлэл хулгайлах фишинг шинж юм. Ийм имэйл ирвэл холбоосыг огт дарахгүйгээр Roblox аппаасаа шууд нэвтэрч акаунтынхаа байдлыг шалгаарай.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18",
    orderIndex: 2,
    category: "email_phishing",
    emailFrom: "YouTube <no-reply@youtube.com>",
    emailSubject: "📺 Таны захиалсан суваг шинэ видео оруулав",
    emailBody: `Та захиалсан MineCraft Tutorials MN сувагт шинэ видео нийтлэгдлээ.

🎬 "Top 10 Survival Tips 2024"

⏱ 15:42 | 👁 12K үзэгч`,
    emailUrl: "https://youtube.com/notifications",
    isPhish: false,
    explanation: "✅ YouTube-ийн жинхэнэ мэдэгдэл — no-reply@youtube.com хаягаас ирсэн. Ямар ч мэдээлэл нэхэхгүй, зөвхөн шинэ видеоны тухай мэдэгдэж байна.",
    recommendation: "no-reply@youtube.com нь YouTube-ийн албан ёсны домэйн бөгөөд имэйл нь зөвхөн таны захиалсан MineCraft Tutorials MN сувгийн шинэ видеоны тухай мэдэгдэж, ямар ч нууц мэдээлэл нэхэхгүй байгаа нь жинхэнэ мэдэгдлийн шинж. Гэсэн хэдий ч бүх YouTube имэйл дэх холбоосын домэйн youtube.com-д чиглэж байгаа эсэхийг шалгаж байгаарай.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18",
    orderIndex: 3,
    category: "url_spoofing",
    emailFrom: "Minecraft Team <team@minecraft-gift.net>",
    emailSubject: "🎁 Үнэгүй Minecraft Premium аккаунт хожлоо!",
    emailBody: `Чамайг Minecraft Premium тоглогч болгохоор сонгогдлоо.

Таны нэрийг шагналын жагсаалтаас олсон.

Шагналаа авахын тулд Microsoft акаунтынхаа нэвтрэх мэдээллийг оруулна уу.`,
    emailUrl: "https://minecraft-gift.net/premium/claim",
    isPhish: true,
    explanation: "🔍 \"minecraft-gift.net\" нь Minecraft-ийн жинхэнэ домэйн биш. Minecraft нь minecraft.net ашигладаг. \"Тусгайлан сонгогдлоо\" гэдэг нь луйварчдын нийтлэг арга!",
    recommendation: "Илгээгч нь minecraft-gift.net домэйн ашигласан боловч Minecraft-ийн жинхэнэ домэйн minecraft.net — \"тусгайлан сонгогдлоо\" гэх шагналын шахалт нь Microsoft акаунтын нэвтрэх мэдээлэл хулгайлах фишинг тактик юм. Microsoft акаунтынхаа нэвтрэх мэдээллийг имэйлийн холбоосоор огт оруулахгүйгээр, зөвхөн minecraft.net сайтаас шууд нэвтэрнэ үү.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18",
    orderIndex: 4,
    category: "email_phishing",
    emailFrom: "Discord <noreply@discord.com>",
    emailSubject: "Таны Discord серверт шинэ гишүүн нэгдлээ 👋",
    emailBody: `MongoGamer_MN таны "Mongolian Gamers" серверт нэгдлээ.

Серверт нийт 142 гишүүн байна.`,
    emailUrl: "https://discord.com/notifications",
    isPhish: false,
    explanation: "✅ Discord-ийн жинхэнэ мэдэгдэл — noreply@discord.com хаягаас ирсэн. Ямар ч хувийн мэдээлэл эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.",
    recommendation: "noreply@discord.com нь Discord-ийн албан ёсны домэйн бөгөөд имэйл нь зөвхөн \"Mongolian Gamers\" серверт нэгдсэн гишүүний тухай мэдэгдэж, нууц үг эсвэл нэвтрэх мэдээлэл огт нэхээгүй байгаа нь жинхэнэ мэдэгдлийн шинж юм. Discord-ийн имэйл ирэх бүрд илгээгчийн домэйн discord.com-д байгаа эсэхийг шалгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "6-18",
    orderIndex: 5,
    category: "url_spoofing",
    emailFrom: "TikTok Verify <verify@tiktok-creator-fund.xyz>",
    emailSubject: "⭐ Таны TikTok акаунт баталгаажуулагдах боломжтой!",
    emailBody: `Таны TikTok акаунт баталгаажсан тэмдэг авах боломжтой болоод байна!

Creator Fund-д бүртгүүлж баталгаажуулалт авах.

⏰ Энэ урилга 24 цаг л хүчинтэй.`,
    emailUrl: "https://tiktok-creator-fund.xyz/verify",
    isPhish: true,
    explanation: "🔍 TikTok-ийн жинхэнэ домэйн нь tiktok.com байдаг — \".xyz\" домэйн ашигласан нь луйвар. TikTok баталгаажуулалтыг зөвхөн аппын дотор хийдэг, имэйлээр биш.",
    recommendation: "Илгээгч нь tiktok-creator-fund.xyz домэйн ашигласан боловч TikTok-ийн жинхэнэ домэйн tiktok.com — \"24 цаг\" гэх яаралтай хугацаа нь хэрэглэгчийг сандруулж шалгалгүй дарахад хүргэх фишинг шахалтын арга юм. TikTok баталгаажуулалтыг зөвхөн өөрийн аппын дотоод тохиргооноос хийдэг тул имэйлийн холбоосыг дарахгүй байгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "6-18",
    orderIndex: 6,
    category: "email_phishing",
    emailFrom: "Google <no-reply@accounts.google.com>",
    emailSubject: "Таны Google акаунтад шинэ нэвтрэлт",
    emailBody: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.

💻 Chrome · 📍 Улаанбаатар, Монгол

📅 Өнөөдөр 14:22

Хэрэв энэ та бол юу ч хийх шаардлагагүй.`,
    emailUrl: "https://accounts.google.com/security",
    isPhish: false,
    explanation: "✅ Google-ийн жинхэнэ мэдэгдэл — @accounts.google.com хаягаас ирсэн. Яаралтай байдал эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.",
    recommendation: "no-reply@accounts.google.com нь Google-ийн албан ёсны домэйн бөгөөд имэйл нь нэвтрэлтийн байршил, цагийг тодорхой зааж, \"хэрэв энэ та бол юу ч хийх шаардлагагүй\" гэж мэдэгдсэн нь нууц мэдээлэл нэхэхгүй жинхэнэ аюулгүй байдлын мэдэгдэл юм. Гэсэн хэдий ч та нэвтрэхгүй байгаа бол Google аппаасаа accounts.google.com/security хаягт шууд нэвтрэж шалгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "6-18",
    orderIndex: 7,
    category: "url_spoofing",
    emailFrom: "Steam Support <support@steam-trade-secure.com>",
    emailSubject: "🔒 Таны Steam Trade Offer хүлээгдэж байна",
    emailBody: `Таны Steam акаунтад Trade Offer ирсэн байна.

🎮 Тоглоом: CS2 Knife (Factory New)

💰 Үнэ цэнэ: $450+

Баталгаажуулахын тулд Steam Guard кодоо оруулна уу.`,
    emailUrl: "https://steam-trade-secure.com/trade/confirm",
    isPhish: true,
    explanation: "🔍 \"steam-trade-secure.com\" нь Steam-ийн домэйн биш — жинхэнэ нь steampowered.com. Steam Guard кодоо гуравдагч этгээдэд хэзээ ч өгч болохгүй!",
    recommendation: "Илгээгч нь steam-trade-secure.com домэйн ашигласан боловч Steam-ийн жинхэнэ домэйн steampowered.com — $450+ үнэт CS2 Knife-ийн trade санал хийж Steam Guard код нэхсэн нь гуравдагч сайтаар мэдээлэл хулгайлах фишинг юм. Steam Guard кодоо зөвхөн Steam клиент апп дотроо ашиглаж, гуравдагч сайтад хэзээ ч оруулахгүй байгаарай.",
    difficulty: 4,
  },
  {
    ageGroup: "6-18",
    orderIndex: 8,
    category: "email_phishing",
    emailFrom: "Spotify <no-reply@spotify.com>",
    emailSubject: "Таны Spotify Premium дуусч байна 🎵",
    emailBody: `Таны Spotify Premium захиалга 7 хоногийн дотор дуусна.

Үргэлжлүүлэн сонсох бол захиалгаа шинэчилнэ үү.

📅 Дуусах огноо: 2024-04-15`,
    emailUrl: "https://spotify.com/account/subscription",
    isPhish: false,
    explanation: "✅ Spotify-ийн жинхэнэ мэдэгдэл — no-reply@spotify.com хаягаас ирсэн. Тодорхой огноотой, ямар ч яаралтай аюул заналхийлэл байхгүй.",
    recommendation: "no-reply@spotify.com нь Spotify-ийн албан ёсны домэйн бөгөөд имэйл нь дуусах огноог тодорхой зааж (2024-04-15), нууц үг эсвэл төлбөрийн мэдээлэл огт нэхээгүй байгаа нь жинхэнэ захиалгын мэдэгдлийн шинж юм. Захиалгаа сунгахыг хүсвэл имэйлийн холбоос дарахын оронд spotify.com сайтад шууд нэвтэрч хийгээрэй.",
    difficulty: 4,
  },
  {
    ageGroup: "6-18",
    orderIndex: 9,
    category: "url_spoofing",
    emailFrom: "Free VPN Pro <admin@freevpn-pro-download.net>",
    emailSubject: "🔓 Үнэгүй VPN — Хязгааргүй хандалт авах",
    emailBody: `Таны сүлжээний аюулгүй байдал эрсдэлтэй байна!

Манай үнэгүй VPN-ийг суулгаснаар:

✅ Бүх вэбсайтад хандах

✅ Таны мэдээллийг хамгаалах

⚡ Одоо татаж аваарай — 1000 хэрэглэгчид үлдсэн!`,
    emailUrl: "https://freevpn-pro-download.net/install",
    isPhish: true,
    explanation: "🔍 Танигдаагүй хаягаас ирсэн \"үнэгүй\" програм суулгах хүсэлт нь маш аюултай. Ийм програм таны төхөөрөмжид хортой код суулгаж, мэдээллийг хулгайлж болно.",
    recommendation: "Илгээгч нь freevpn-pro-download.net гэх үл мэдэгдэх домэйнаас \"1000 хэрэглэгчид л үлдсэн\" гэх хиймэл дутагдлаар програм суулгахыг шахсан нь хортой код (malware) тараах фишинг аргын сонгодог жишээ юм. Имэйлээр ирсэн ямар ч програмыг суулгахгүйгээр, VPN хэрэгтэй бол зөвхөн Play Store эсвэл App Store-оос татаж аваарай.",
    difficulty: 4,
  },
  {
    ageGroup: "6-18",
    orderIndex: 10,
    category: "email_phishing",
    emailFrom: "Gmail <no-reply@accounts.google.com>",
    emailSubject: "📧 Таны Google Drive-д файл хуваалцлагдлаа",
    emailBody: `Багш Д.Болд танд Google Drive дээр файл хуваалцлаа.

📄 "11-р ангийн математик даалгавар.pdf"

📁 Хэмжээ: 2.4 MB`,
    emailUrl: "https://accounts.google.com/drive-share",
    isPhish: false,
    explanation: "✅ Google Drive-ийн жинхэнэ мэдэгдэл. Домэйн нь accounts.google.com, агуулга тодорхой, ямар ч хувийн мэдээлэл нэхэхгүй байна.",
    recommendation: "no-reply@accounts.google.com нь Google-ийн албан ёсны домэйн бөгөөд имэйл нь файлын нэр, хэмжээг тодорхой зааж, нууц үг эсвэл хувийн мэдээлэл огт нэхэхгүй байгаа нь жинхэнэ Google Drive хуваалцалтын мэдэгдэл юм. Файлыг нээхдээ хөтчийн URL баар дахь домэйн accounts.google.com-д байгаа эсэхийг баталгаажуулаарай.",
    difficulty: 2,
  },

  // ============================================
  // Age group: 18-35
  // ============================================
  {
    ageGroup: "18-35",
    orderIndex: 1,
    category: "email_phishing",
    emailFrom: "Google <no-reply@accounts.google.com>",
    emailSubject: "Таны Google Бүртгэлийг амжилттай сэргээлээ",
    emailBody: `Google

Бүртгэлийг амжилттай сэргээлээ

  У

  uurtsaihgelegmaa@gmail.com

Бүртгэлдээ дахин тавтай морилно уу

Хэрэв та хэн нэгний хийсэн өөрчлөлтийн улмаас бүртгэлдээ нэвтэрч чадахгүй түгжигдсэн гэж үзвэл бүртгэлээ шалгаад & хамгаална уу.

Таны Google Бүртгэл болон үйлчилгээний чухал өөрчлөлтийг мэдэгдэхийн тулд энэ имэйлийг илгээсэн болно.
© 2026 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA`,
    emailUrl: "https://accounts.google.com/security",
    isPhish: false,
    explanation: "✅ Энэ бол Google-ийн жинхэнэ имэйл. Илгээгч нь no-reply@accounts.google.com — Google-ийн албан ёсны домэйн. URL баар нь accounts.google.com. Ямар ч нууц мэдээлэл нэхэхгүй, яаралтай аюул заналхийлэл байхгүй.",
    recommendation: "no-reply@accounts.google.com нь Google-ийн албан ёсны домэйн бөгөөд имэйл нь акаунт амжилттай сэргэсний баталгаажуулалтыг мэдэгдэж, нууц үг эсвэл PIN нэхэхгүй байгаа нь жинхэнэ Google мэдэгдлийн шинж юм. Хэрэв та энэ акаунт сэргэлтийг хийгээгүй бол accounts.google.com/security хаягт шууд нэвтрэж нэвтрэлтийн бүртгэлийг шалгаарай.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35",
    orderIndex: 2,
    category: "url_spoofing",
    emailFrom: "PayPal Security <security@paypa1-verify.com>",
    emailSubject: "⚠️ Таны акаунт хязгаарлагдсан байна!",
    emailBody: `Таны PayPal акаунт сэжигтэй үйл ажиллагааны улмаас түр хязгаарлагдсан байна.

Акаунтаа бүрэн сэргээхийн тулд мэдээллээ яаралтай баталгаажуулна уу. 24 цагийн дотор баталгаажуулаагүй тохиолдолд акаунт байнга хаагдах болно.`,
    emailUrl: "https://paypa1-verify.com/account/secure",
    isPhish: true,
    explanation: "🔍 \"paypa1-verify.com\" — \"l\" үсгийн оронд \"1\" тоо ашигласан. URL баар-г анхаарч үзэх хэрэгтэй. Яаралтай хэл болон аюул заналхийлэх нь сонгодог фишинг тактик.",
    recommendation: "Илгээгч нь paypa1-verify.com домэйн ашигласан — \"l\" үсгийн оронд \"1\" тоо бичсэн typosquatting арга бөгөөд \"24 цагийн дотор хаагдана\" гэх аюул заналхийлэл нь хэрэглэгчийг сандруулж шалгалгүй дарахад хүргэх фишинг тактик юм. PayPal акаунтынхаа байдлыг шалгахыг хүсвэл имэйлийн холбоосыг огт дарахгүйгээр paypal.com хаягт хөтчөөс шууд нэвтэрнэ үү.",
    difficulty: 2,
  },
  {
    ageGroup: "18-35",
    orderIndex: 3,
    category: "email_phishing",
    emailFrom: "GitHub <noreply@github.com>",
    emailSubject: "Таны pull request нэгтгэгдлээ ✅",
    emailBody: `Сайн байна уу,

Таны pull request #1247 — "Fix login button alignment" хэрэглэгч @devlead main branch руу нэгтгэлээ.

CI/CD pipeline амжилттай дууслаа. Таны өөрчлөлт production дээр идэвхтэй байна.`,
    emailUrl: "https://mail.github.com/notifications",
    isPhish: false,
    explanation: "✅ GitHub-ийн жинхэнэ мэдэгдэл — домэйн github.com, агуулга техникийн шинжтэй, яаралтай байдал эсвэл аюул заналхийлэл огт байхгүй.",
    recommendation: "noreply@github.com нь GitHub-ийн албан ёсны домэйн бөгөөд имэйл нь PR дугаар (#1247), branch нэр, CI/CD үр дүнг тодорхой зааж, нууц үг эсвэл токен огт нэхэхгүй байгаа нь жинхэнэ хамтын ажиллагааны мэдэгдэл юм. GitHub-ийн имэйл ирэх бүрд илгээгчийн домэйн github.com-д байгаа эсэхийг шалгаж байгаарай.",
    difficulty: 2,
  },
  {
    ageGroup: "18-35",
    orderIndex: 4,
    category: "url_spoofing",
    emailFrom: "Apple ID Support <appleid@apple-id-secure.net>",
    emailSubject: "🚨 Таны Apple ID танигдаагүй газраас нэвтрэв",
    emailBody: `Таны Apple ID танигдаагүй төхөөрөмжөөс нэвтэрсэн байна.

📍 Москва, Орос — Windows PC

🕐 Цаг: Өнөөдөр 03:47

Хэрэв энэ та биш бол таны акаунт аюулд орсон байж болзошгүй. Доорх товчийг яаралтай дарна уу.`,
    emailUrl: "https://apple-id-secure.net/verify",
    isPhish: true,
    explanation: "🔍 \"apple-id-secure.net\" — Apple-ийн жинхэнэ домэйн нь apple.com байдаг. \".net\" домэйн ашигласан нь хуурамч. Зөвшөөрөлгүй нэвтрэлтийн мэдэгдэл хэлбэрийн айлган сүрдүүлэх нь нийтлэг фишинг арга.",
    recommendation: "Илгээгч нь apple-id-secure.net домэйн ашигласан боловч Apple-ийн жинхэнэ домэйн apple.com — \"Москва, 03:47\" гэх гадаадын нэвтрэлт хиймэлдлэж \"яаралтай дарна уу\" гэж шахсан нь айдас ашигласан фишинг тактик юм. Apple ID-ийн аюулгүй байдлыг шалгахыг хүсвэл зөвхөн appleid.apple.com хаягт хөтчөөс шууд нэвтэрнэ үү.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 5,
    category: "email_phishing",
    emailFrom: "Google <no-reply@accounts.google.com>",
    emailSubject: "Mac дээрх Chrome-д шинэ нэвтрэлт",
    emailBody: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.

📅 Даваа гараг, 3-р сарын 29 · 09:15

💻 macOS дээрх Chrome · 📍 Улаанбаатар, Монгол

Хэрэв энэ та бол юу ч хийх шаардлагагүй. Үгүй бол доорх товчийг дарж шалгана уу.`,
    emailUrl: "https://accounts.google.com/security-notifications",
    isPhish: false,
    explanation: "✅ Google-ийн жинхэнэ аюулгүй байдлын имэйл — @accounts.google.com хаягаас ирсэн. Аймшигтай хэл болон хиймэл яаралтай байдал огт байхгүй.",
    recommendation: "no-reply@accounts.google.com нь Google-ийн албан ёсны домэйн бөгөөд имэйл нь macOS дахь Chrome, Улаанбаатар байршлын нэвтрэлтийг тодорхой зааж, нууц мэдээлэл нэхэхгүй байгаа нь жинхэнэ аюулгүй байдлын мэдэгдэл юм. Хэрэв тухайн нэвтрэлт та биш бол accounts.google.com/security хаягт хөтчөөс шууд нэвтрэж нэвтрэлтийг хориглоорой.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 6,
    category: "url_spoofing",
    emailFrom: "Amazon Order <orders@amazon-delivery-update.co>",
    emailSubject: "📦 Таны багц хүргэгдэх боломжгүй байна",
    emailBody: `Таны захиалгыг бүрэн бус хаягийн улмаас хүргэх боломжгүй байна.

📦 Захиалга #302-8827463-9912847

⏳ Манай агуулахад 48 цаг л хадгалагдана.

Хүргэлтийг дахин товлохын тулд хаягаа шинэчилж $1.99 дахин хүргэлтийн төлбөр төлнө үү.`,
    emailUrl: "https://amazon-delivery-update.co/reship",
    isPhish: true,
    explanation: "🔍 Amazon хэзээ ч \"amazon-delivery-update.co\" гэх домэйн ашигладаггүй. Дахин хүргэлтэд мөнгө нэхэх нь томоохон анхааруулга — Amazon хүргэлтийн асуудлыг зөвхөн албан ёсны app-аараа шийддэг.",
    recommendation: "Илгээгч нь amazon-delivery-update.co домэйн ашигласан боловч Amazon-ийн жинхэнэ домэйн amazon.com — \"48 цаг\" хугацааны шахалт болон $1.99 дахин хүргэлтийн төлбөр нэхсэн нь хэрэглэгчийн картын мэдээлэл хулгайлах фишинг юм. Хүргэлтийн асуудал байгаа эсэхийг шалгахыг хүсвэл amazon.com аппаасаа захиалгынхаа статусыг шалгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 7,
    category: "email_phishing",
    emailFrom: "Slack <feedback@slack.com>",
    emailSubject: "Slack дээр Acme Corp-д урьсан байна 🎉",
    emailBody: `Жон Смит танийг Slack дээрх Acme Corp ажлын орон зайд урьж байна.

Урилгыг хүлээн авч профайлаа тохируулснаар эхлээрэй. Та багтайгаа хаанаас ч хамтран ажиллах боломжтой.`,
    emailUrl: "https://slack.com/intl/mn/invites",
    isPhish: false,
    explanation: "✅ Албан ёсны feedback@slack.com хаягаас ирсэн стандарт Slack урилга. Яаралтай байдал эсвэл аюул заналхийлэл байхгүй — зүгээр л энгийн багийн урилга.",
    recommendation: "feedback@slack.com нь Slack-ийн албан ёсны домэйн бөгөөд имэйл нь Acme Corp-ын багийн урилгыг мэдэгдэж, яаралтай байдал эсвэл нууц мэдээлэл огт нэхэхгүй байгаа нь жинхэнэ урилгын мэдэгдэл юм. Ажлын урилгын имэйл ирэх бүрд илгээгчийн домэйн slack.com-д байгаа эсэхийг шалгаж, холбоос дахь URL slack.com/intl-д чиглэж байгаа эсэхийг нягтлаарай.",
    difficulty: 2,
  },
  {
    ageGroup: "18-35",
    orderIndex: 8,
    category: "credential_theft",
    emailFrom: "IT Department <it-support@company-helpdesk.xyz>",
    emailSubject: "🚨 ЯАРАЛТАЙ: Нууц үг 1 цагийн дотор дуусна",
    emailBody: `⚡ ЯАРАЛТАЙ ҮЙЛДЭЛ ШААРДЛАГАТАЙ

Таны сүлжээний нууц үг 60 минутын дотор дуусна. Компанийн бүх системд нэвтрэх эрхээ алдахгүйн тулд нууц үгээ яаралтай сэлбэнэ үү.

Энэ бол таны сүүлчийн сануулга. Доорх товчийг дарж одоо сэлбэнэ үү.`,
    emailUrl: "https://company-helpdesk.xyz/password-reset",
    isPhish: true,
    explanation: "🔍 Жинхэнэ IT хэлтэс гадны \".xyz\" домэйн биш, компанийн өөрийн домэйн ашигладаг. \"60 минут!\" гэх экстрем яаралтай байдал нь хүнийг сандруулж, шалгалгүй дарахад хүргэх арга техник.",
    recommendation: "Илгээгч нь company-helpdesk.xyz гэх гадны домэйн ашигласан бөгөөд жинхэнэ IT хэлтэс компанийн өөрийн домэйн ашиглах ёстой — \"60 минутын дотор бүх системд эрхээ алдана\" гэх экстрем яаралтай байдал нь нийгмийн инженерчлэлийн фишинг шахалт юм. Нууц үг солих хүсэлт ирвэл имэйлийн холбоосыг дарахгүйгээр IT хэлтэстэй утсаар холбогдоно уу.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35",
    orderIndex: 9,
    category: "email_phishing",
    emailFrom: "Netflix <info@mailer.netflix.com>",
    emailSubject: "Netflix — Энэ сарын шинэ нэмэлтүүд 🎬",
    emailBody: `Сайн байна уу,

Таны үзсэн зүйлд үндэслэн энэ сарын шинэ нэмэлтүүдийг танд таалагдана гэж бодож байна:

🎬 Цувралын санал 1 — Шинэ улирал

🎬 Цувралын санал 2 — Шинэ нэмэлт

🎬 Баримтат кино — Онцлох`,
    emailUrl: "https://mailer.netflix.com/recommendations",
    isPhish: false,
    explanation: "✅ Netflix маркетингийн имэйлдээ mailer.netflix.com ашигладаг. Яаралтай байдал, хувийн мэдээлэл нэхэх, аюул заналхийлэл огт байхгүй — энгийн зөвлөмжийн имэйл.",
    recommendation: "info@mailer.netflix.com нь Netflix-ийн маркетингийн зориулалттай albан ёсны subdomain бөгөөд имэйл нь үзсэн контентод тулгуурлан зөвлөмж өгч, нууц мэдээлэл эсвэл яаралтай байдал огт нэхэхгүй байгаа нь жинхэнэ маркетингийн мэдэгдэл юм. Netflix-ийн имэйл ирэх бүрд илгээгчийн домэйн netflix.com эсвэл mailer.netflix.com гэж байгаа эсэхийг шалгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 10,
    category: "credential_theft",
    emailFrom: "Bank of America <alert@bofa-secure-notification.com>",
    emailSubject: "⚠️ Таны акаунтаас сэжигтэй гүйлгээ илэрлээ",
    emailBody: `Таны Bank of America акаунтаас зөвшөөрөлгүй $847.00 гүйлгээ илэрлээ.

📍 Байршил: Нью-Йорк, АНУ

🕐 Цаг: Өнөөдөр 02:13

Энэ төлбөрийг маргаан болгож акаунтаа хамгаалахын тулд онлайн банкны нэвтрэх мэдээллээ оруулж өгнө үү. 2 цагийн дотор арга хэмжээ аваагүй бол таны акаунт хөлдөөгдөх болно.`,
    emailUrl: "https://bofa-secure-notification.com/verify",
    isPhish: true,
    explanation: "🔍 Жинхэнэ банкнууд хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй. \"bofa-secure-notification.com\" нь Bank of America-ийн жинхэнэ домэйн bankofamerica.com БИШ. 2 цагийн хугацаа хиймэл дарамт.",
    recommendation: "Илгээгч нь bofa-secure-notification.com домэйн ашигласан боловч Bank of America-ийн жинхэнэ домэйн bankofamerica.com — \"Нью-Йоркоос $847 зөвшөөрөлгүй гүйлгээ\" гэж айлган нэвтрэх мэдээлэл нэхсэн нь нийгмийн инженерчлэлийн credential theft фишинг юм. Банкны имэйл ирвэл нэвтрэх мэдээллийг огт оруулахгүйгээр, картынхаа ард байгаа утасны дугаарт залгаж шалгаарай.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35",
    orderIndex: 11,
    category: "email_phishing",
    emailFrom: "Dropbox <no-reply@dropbox.com>",
    emailSubject: "Сара танд хавтас хуваалцлаа 📁",
    emailBody: `Сара Жонсон танд Dropbox дээр хавтас хуваалцлаа.

📁 "Q1 2026 Reports"

📊 8 файл · 42 MB

Та файлуудыг хэдийд ч харж, татаж авах боломжтой.`,
    emailUrl: "https://dropbox.com/share-notification",
    isPhish: false,
    explanation: "✅ Албан ёсны no-reply@dropbox.com хаягаас ирсэн жинхэнэ Dropbox мэдэгдэл. Тодорхой, аюул заналхийлэлгүй хамтран ажиллах энгийн мэдэгдэл.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@dropbox.com хаяг ашигласан. 2) Файлын нэр, хэмжээ, тоо тодорхой — нууц мэдээлэл нэхэхгүй. 3) Хамт ажилладаг хүний файл хуваалцалт — хүлээгдсэн, аюул заналхийлэлгүй агуулга.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35",
    orderIndex: 12,
    category: "credential_theft",
    emailFrom: "МонПэй <support@monpay-secure-mn.com>",
    emailSubject: "⚠️ МонПэй данс хөлдөөгдсөн — яаралтай баталгаажуул",
    emailBody: `Таны МонПэй данс сэжигтэй үйл ажиллагааны улмаас түр хөлдөөгдсөн байна.

💳 Данс сэргээх үйлдэл шаардлагатай.

⏳ Хугацаа: 12 цаг

Дансаа сэргээхийн тулд нэвтрэх мэдээллээ оруулна уу.`,
    emailUrl: "https://monpay-secure-mn.com/verify",
    isPhish: true,
    explanation: "🔍 МонПэй-ийн жинхэнэ домэйн нь monpay.mn. \"monpay-secure-mn.com\" нь хуурамч. МонПэй хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — апп дотроо л нэвтэрнэ үү!",
    recommendation: "1) Домэйн шалгах: МонПэй-ийн жинхэнэ домэйн нь monpay.mn — monpay-secure-mn.com нь хуурамч. 2) МонПэй хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — данс хөлдсөн бол апп дотроо буюу 7777-1234 утсаар холбогд. 3) \"12 цаг\" хугацааны дарамт нь сандруулах арга — сандрахгүйгээр шалга.",
    difficulty: 2,
  },
  {
    ageGroup: "18-35",
    orderIndex: 13,
    category: "email_phishing",
    emailFrom: "МонПэй <noreply@monpay.mn>",
    emailSubject: "МонПэй: Таны гүйлгээний баримт",
    emailBody: `Гүйлгээний баримт:

💸 Дүн: ₮25,000

📍 Хүлээн авагч: Номын дэлгүүр MN

📅 Огноо: 2026-04-03 · 11:22

🆔 Баримтын дугаар: TXN-88472`,
    emailUrl: "https://monpay.mn/transaction",
    isPhish: false,
    explanation: "✅ МонПэй-ийн жинхэнэ гүйлгээний мэдэгдэл. Домэйн нь @monpay.mn, тодорхой баримтын дугаартай, ямар ч нэмэлт үйлдэл нэхэхгүй байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны noreply@monpay.mn хаяг ашигласан. 2) Баримтын дугаар, дүн, хүлээн авагч тодорхой — ямар ч нэмэлт үйлдэл нэхэхгүй. 3) МонПэй гүйлгээний баримтыг apп дотроо мөн харах боломжтой — тохирч байна.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 14,
    category: "credential_theft",
    emailFrom: "Голомт Банк <alert@golomtbank-security.org>",
    emailSubject: "🚨 Голомт: Таны картаас зөвшөөрөлгүй гүйлгээ",
    emailBody: `Таны Голомт Банкны картаас зөвшөөрөлгүй гүйлгээ илэрлээ.

💳 Дүн: ₮1,200,000

📍 Байршил: Сеул, Солонгос

Картаа блоклохын тулд PIN болон карт дугаараа оруулна уу.`,
    emailUrl: "https://golomtbank-security.org/block",
    isPhish: true,
    explanation: "🔍 \"golomtbank-security.org\" — Голомт Банкны жинхэнэ домэйн нь golomtbank.mn. Банк хэзээ ч имэйлээр PIN нэхдэггүй. Сэжигтэй бол 1800-1111 дугаарт залгаарай!",
    recommendation: "1) Домэйн шалгах: Голомт Банкны жинхэнэ домэйн нь golomtbank.mn — golomtbank-security.org нь хуурамч. 2) Банк хэзээ ч имэйлээр PIN, карт дугаар асуудаггүй — сэжигтэй бол 1800-1111 дугаарт шууд залга. 3) ₮1,200,000 шиг том дүн, Сеул байршил нь айдас төрүүлэх зорилготой — сандрахгүйгээр шалга.",
    difficulty: 3,
  },
  {
    ageGroup: "18-35",
    orderIndex: 15,
    category: "email_phishing",
    emailFrom: "TDB Bank <notification@tdbbank.mn>",
    emailSubject: "TDB: Таны зээлийн хуулгын мэдэгдэл",
    emailBody: `Сайн байна уу,

Таны TDB кредит картын сарын хуулга бэлэн боллоо.

📅 Хугацаа: 2026 оны 3-р сар

💳 Нийт зарлага: ₮840,000

📆 Төлбөрийн дэдлайн: 2026-04-15`,
    emailUrl: "https://tdbbank.mn/statement",
    isPhish: false,
    explanation: "✅ TDB Банкны жинхэнэ мэдэгдэл — @tdbbank.mn домэйнаас ирсэн. Ямар ч нууц мэдээлэл нэхэхгүй, зөвхөн хуулгын мэдэгдэл.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны notification@tdbbank.mn хаяг ашигласан. 2) Зарлагын нийт дүн, төлбөрийн дедлайн тодорхой — нууц мэдээлэл нэхэхгүй. 3) TDB Банкны аппаас хуулгаа шалгах боломжтой — тохирч байна.",
    difficulty: 4,
  },

  // ============================================
  // Age group: 35-60+
  // ============================================
  {
    ageGroup: "35-60+",
    orderIndex: 1,
    category: "credential_theft",
    emailFrom: "Хаан Банк <security@khanbank-verify.com>",
    emailSubject: "⚠️ Таны банкны карт хаагдахаас өмнө баталгаажуулна уу",
    emailBody: `Таны Хаан Банкны карт системийн шинэчлэлтийн улмаас 24 цагийн дараа хаагдах болно.

Картаа идэвхтэй байлгахын тулд мэдээллээ яаралтай баталгаажуулна уу.

PIN болон карт дугаараа оруулж баталгаажуулна уу.`,
    emailUrl: "https://khanbank-verify.com/card/activate",
    isPhish: true,
    explanation: "🔍 \"khanbank-verify.com\" нь Хаан Банкны жинхэнэ домэйн биш. Банкнууд хэзээ ч имэйлээр PIN эсвэл карт дугаар асуудаггүй. Ийм имэйл ирвэл банкаа шууд залгаарай!",
    recommendation: "1) Домэйн шалгах: Хаан Банкны жинхэнэ домэйн нь khanbank.mn — khanbank-verify.com нь хуурамч. 2) Банк хэзээ ч имэйлээр PIN эсвэл карт дугаар асуудаггүй — карт идэвхжүүлэлтийг зөвхөн ХБ аппаас хий. 3) \"24 цаг\" аюул заналхийлэл нь шахалтын арга — сандрахгүйгээр 1800-1234 залга.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 2,
    category: "email_phishing",
    emailFrom: "Khan Bank <notification@khanbank.mn>",
    emailSubject: "Таны данснаас шилжүүлэг хийгдлээ",
    emailBody: `Таны дансны гүйлгээний мэдэгдэл:

💳 Данс: ****5892

💰 Шилжүүлсэн: ₮150,000

📅 Огноо: 2024-03-15 14:30

Хэрэв энэ гүйлгээ та биш хийсэн бол 1800-1234 дугаарт залгана уу.`,
    emailUrl: "https://khanbank.mn/notifications",
    isPhish: false,
    explanation: "✅ Хаан Банкны жинхэнэ мэдэгдэл — @khanbank.mn домэйнаас ирсэн. Гүйлгээний дугаар тодорхой, банкны утасны дугаар зөв байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны notification@khanbank.mn хаяг ашигласан. 2) Данс дугаар хагас нуугдсан (****5892), дүн, огноо тодорхой. 3) Хэрэв та биш бол залгах утасны дугаар өгсөн — жинхэнэ банкны мэдэгдлийн загвар.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 3,
    category: "url_spoofing",
    emailFrom: "Нийгмийн даатгал <info@ndaatgal-payment.org>",
    emailSubject: "📋 Таны тэтгэвэр/тэтгэмж олгох хүсэлт баталгаажуулах",
    emailBody: `Таны нийгмийн даатгалын тэтгэмж олгох хүсэлт бүртгэгдлээ.

Олголтоо авахын тулд иргэний үнэмлэхийн дугаар болон банкны дансны мэдээллийг оруулна уу.

⏰ Хугацаа: 48 цаг`,
    emailUrl: "https://ndaatgal-payment.org/verify",
    isPhish: true,
    explanation: "🔍 Нийгмийн даатгалын газрын жинхэнэ домэйн нь ndaatgal.mn. Имэйлээр иргэний дугаар болон банкны мэдээлэл асуудаггүй — энэ нь луйвар!",
    recommendation: "1) Домэйн шалгах: Нийгмийн даатгалын газрын жинхэнэ домэйн нь ndaatgal.mn — ndaatgal-payment.org нь хуурамч. 2) Нийгмийн даатгал имэйлээр иргэний үнэмлэхний дугаар, банкны мэдээлэл асуудаггүй — зөвхөн ндаатгал.мн сайтаас эсвэл биечлэн. 3) \"48 цаг\" хугацааны дарамт нь сандруулах зорилготой — тайвнаар шалга.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 4,
    category: "email_phishing",
    emailFrom: "Google <no-reply@accounts.google.com>",
    emailSubject: "Таны Gmail акаунтад шинэ нэвтрэлт",
    emailBody: `Таны Google акаунтад шинэ нэвтрэлт илэрлээ.

📅 2024-03-15 · 09:15

💻 Chrome · 📍 Улаанбаатар, Монгол

Хэрэв энэ та бол юу ч хийх шаардлагагүй.`,
    emailUrl: "https://accounts.google.com/security",
    isPhish: false,
    explanation: "✅ Google-ийн жинхэнэ аюулгүй байдлын имэйл. Домэйн нь @accounts.google.com, ямар ч яаралтай аюул байхгүй.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@accounts.google.com хаяг ашигласан. 2) Нэвтрэлтийн байршил (Улаанбаатар), төхөөрөмж (Chrome), цаг тодорхой. 3) \"Хэрэв энэ та бол юу ч хийх шаардлагагүй\" — хиймэл яаралтай байдал байхгүй.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 5,
    category: "url_spoofing",
    emailFrom: "Amazon Mongolia <orders@amazon-mn-delivery.co>",
    emailSubject: "📦 Таны захиалга хүргэгдэх боломжгүй",
    emailBody: `Таны захиалгыг хүргэх боломжгүй болоод байна.

📦 Захиалга: #MN-88274639

⏳ Агуулахад 48 цаг л хадгалагдана.

Хаягаа шинэчилж $2.99 дахин хүргэлтийн төлбөр төлнө үү.`,
    emailUrl: "https://amazon-mn-delivery.co/reship",
    isPhish: true,
    explanation: "🔍 Amazon хэзээ ч \"amazon-mn-delivery.co\" гэх домэйн ашигладаггүй. Хүргэлтэд нэмэлт мөнгө нэхэх нь луйвар — Amazon-ийн аппаа ашигла!",
    recommendation: "1) Домэйн шалгах: Amazon-ийн жинхэнэ домэйн нь amazon.com — amazon-mn-delivery.co нь хуурамч. 2) Amazon хэзээ ч хүргэлтэд нэмэлт мөнгө нэхдэггүй — захиалгаа amazon.com аппаасаа шалга. 3) \"48 цаг\" хугацааны дарамт нь луйварчдын нийтлэг шахалтын арга.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 6,
    category: "url_spoofing",
    emailFrom: "Microsoft Support <support@microsoft-security-alert.net>",
    emailSubject: "🚨 Таны компьютерт вирус илэрлээ!",
    emailBody: `⚠️ АЮУЛ ИЛЭРЛЭЭ!

Таны компьютерт 3 вирус илэрлээ. Системийн мэдээлэл алдагдаж болзошгүй.

Microsoft-ийн техникийн баг одоо туслахад бэлэн байна. Доорх товчийг дарж холбогдоно уу.`,
    emailUrl: "https://microsoft-security-alert.net/scan",
    isPhish: true,
    explanation: "🔍 \"microsoft-security-alert.net\" нь Microsoft-ийн домэйн биш. Microsoft хэзээ ч имэйлээр \"вирус илэрлээ\" гэж мэдэгддэггүй. Энэ бол \"техникийн дэмжлэгийн луйвар\" арга!",
    recommendation: "1) Домэйн шалгах: Microsoft-ийн жинхэнэ домэйн нь microsoft.com — microsoft-security-alert.net нь хуурамч. 2) Microsoft хэзээ ч имэйлээр \"вирус илэрлээ\" гэж мэдэгддэггүй — энэ нь \"техникийн дэмжлэгийн луйвар\" арга. 3) Компьютерт вирус сэжиглэвэл Windows Defender-ийг аппаасаа эсвэл microsoft.com-оос шалга.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 7,
    category: "email_phishing",
    emailFrom: "Dropbox <no-reply@dropbox.com>",
    emailSubject: "Хамт олон танд файл хуваалцлаа 📁",
    emailBody: `Н.Мөнхбаяр танд Dropbox дээр хавтас хуваалцлаа.

📁 "2024 Татварын баримтууд"

📊 12 файл · 15 MB`,
    emailUrl: "https://dropbox.com/share-notification",
    isPhish: false,
    explanation: "✅ Dropbox-ийн жинхэнэ мэдэгдэл — no-reply@dropbox.com хаягаас ирсэн. Ямар ч яаралтай байдал эсвэл нэвтрэх мэдээлэл нэхэхгүй байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@dropbox.com хаяг ашигласан. 2) Хуваалцагчийн нэр, файлын нэр, хэмжээ тодорхой — нууц мэдээлэл нэхэхгүй. 3) \"2024 Татварын баримтууд\" — ажлын хамт олноос хүлээгдэх боломжтой агуулга.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 8,
    category: "url_spoofing",
    emailFrom: "Монгол Шуудан <info@mongolpost-delivery.com>",
    emailSubject: "📮 Таны илгээмж гаалийн хяналтанд байна",
    emailBody: `Таны хүлээн авч буй илгээмж гаалийн хяналтанд байна.

📦 Илгээмжийн дугаар: EE847263901MN

💰 Гаалийн татвар: ₮45,000

Татвараа төлөхгүй бол илгээмжийг буцаана.`,
    emailUrl: "https://mongolpost-delivery.com/customs/pay",
    isPhish: true,
    explanation: "🔍 \"mongolpost-delivery.com\" нь Монгол Шуудангийн жинхэнэ домэйн биш — жинхэнэ нь mongolpost.mn. Гаалийн татвар нэхэх имэйл луйвар байдаг!",
    recommendation: "1) Домэйн шалгах: Монгол Шуудангийн жинхэнэ домэйн нь mongolpost.mn — mongolpost-delivery.com нь хуурамч. 2) Гаалийн татвар нэхэх имэйл нь нийтлэг луйвар — жинхэнэ гаалийн татварыг зөвхөн albан ёсны mongolpost.mn сайт эсвэл биечлэн төлдөг. 3) Илгээмжийн дугаар шалгахыг хүсвэл mongolpost.mn сайтад шууд ор.",
    difficulty: 4,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 9,
    category: "email_phishing",
    emailFrom: "Facebook <security@facebookmail.com>",
    emailSubject: "Таны Facebook акаунтад шинэ нэвтрэлт",
    emailBody: `Таны Facebook акаунтад шинэ нэвтрэлт илэрлээ.

📱 Android утас · 📍 Улаанбаатар

📅 2024-03-15 · 10:44

Энэ та биш бол нууц үгээ солих хэрэгтэй.`,
    emailUrl: "https://facebookmail.com/security-notification",
    isPhish: false,
    explanation: "✅ Facebook аюулгүй байдлын имэйлдээ @facebookmail.com домэйн ашигладаг. Тодорхой мэдээлэлтэй, ямар ч хувийн мэдээлэл нэхэхгүй байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Facebook аюулгүй байдлын имэйлдээ @facebookmail.com домэйн ашигладаг — энэ нь зөв. 2) Нэвтрэлтийн төхөөрөмж (Android), байршил, цаг тодорхой. 3) Нууц мэдээлэл нэхэхгүй — зөвхөн нэвтрэлтийн мэдэгдэл.",
    difficulty: 4,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 10,
    category: "url_spoofing",
    emailFrom: "МУ-ын Засгийн газар <info@gov-mn-payment.org>",
    emailSubject: "📋 Таны нэрт улсын буцаан олголт байна",
    emailBody: `Монгол Улсын Засгийн газраас иргэдэд буцаан олголт хийж байна.

💰 Таны нэрт: ₮480,000

Мөнгөө авахын тулд банкны дансны мэдээлэл болон иргэний үнэмлэхийн дугаараа оруулна уу.`,
    emailUrl: "https://gov-mn-payment.org/refund/claim",
    isPhish: true,
    explanation: "🔍 \"gov-mn-payment.org\" нь Монгол Улсын Засгийн газрын жинхэнэ домэйн биш. Засгийн газар имэйлээр буцаан олголт өгдөггүй — иргэний үнэмлэхийн мэдээллийг хэзээ ч имэйлээр бүү өг!",
    recommendation: "1) Домэйн шалгах: Монгол Улсын Засгийн газрын жинхэнэ домэйн нь gov.mn — gov-mn-payment.org нь хуурамч. 2) Засгийн газар имэйлээр буцаан олголт өгдөггүй — ийм мэдэгдэл ирвэл луйвар гэж ойлго. 3) Иргэний үнэмлэхний дугаараа имэйлээр хэзээ ч бүү өг.",
    difficulty: 4,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 11,
    category: "credential_theft",
    emailFrom: "МонПэй <support@monpay-secure-mn.com>",
    emailSubject: "⚠️ МонПэй данс хөлдөөгдсөн — яаралтай баталгаажуул",
    emailBody: `Таны МонПэй данс сэжигтэй үйл ажиллагааны улмаас түр хөлдөөгдсөн байна.

💳 Данс сэргээх үйлдэл шаардлагатай.

⏳ Хугацаа: 12 цаг

Дансаа сэргээхийн тулд нэвтрэх мэдээллээ оруулна уу.`,
    emailUrl: "https://monpay-secure-mn.com/verify",
    isPhish: true,
    explanation: "🔍 МонПэй-ийн жинхэнэ домэйн нь monpay.mn. \"monpay-secure-mn.com\" нь хуурамч. МонПэй хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — апп дотроо л нэвтэрнэ үү!",
    recommendation: "1) Домэйн шалгах: МонПэй-ийн жинхэнэ домэйн нь monpay.mn — monpay-secure-mn.com нь хуурамч. 2) МонПэй хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — данс асуудалтай бол зөвхөн МонПэй аппаасаа эсвэл 1800-1200 залга. 3) \"12 цаг\" хугацааны дарамт нь сандруулах луйварын арга.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 12,
    category: "email_phishing",
    emailFrom: "МонПэй <noreply@monpay.mn>",
    emailSubject: "МонПэй: Таны гүйлгээний баримт",
    emailBody: `Гүйлгээний баримт:

💸 Дүн: ₮25,000

📍 Хүлээн авагч: Номын дэлгүүр MN

📅 Огноо: 2026-04-03 · 11:22

🆔 Баримтын дугаар: TXN-88472`,
    emailUrl: "https://monpay.mn/transaction",
    isPhish: false,
    explanation: "✅ МонПэй-ийн жинхэнэ гүйлгээний мэдэгдэл. Домэйн нь @monpay.mn, тодорхой баримтын дугаартай, ямар ч нэмэлт үйлдэл нэхэхгүй байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны noreply@monpay.mn хаяг ашигласан. 2) Баримтын дугаар (TXN-88472), дүн, хүлээн авагч, огноо бүгд тодорхой. 3) Ямар ч нэмэлт үйлдэл нэхэхгүй — зөвхөн гүйлгээний мэдэгдэл.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 13,
    category: "credential_theft",
    emailFrom: "Голомт Банк <alert@golomtbank-security.org>",
    emailSubject: "🚨 Голомт: Таны картаас зөвшөөрөлгүй гүйлгээ",
    emailBody: `Таны Голомт Банкны картаас зөвшөөрөлгүй гүйлгээ илэрлээ.

💳 Дүн: ₮1,200,000

📍 Байршил: Сеул, Солонгос

Картаа блоклохын тулд PIN болон карт дугаараа оруулна уу.`,
    emailUrl: "https://golomtbank-security.org/block",
    isPhish: true,
    explanation: "🔍 \"golomtbank-security.org\" — Голомт Банкны жинхэнэ домэйн нь golomtbank.mn. Банк хэзээ ч имэйлээр PIN нэхдэггүй. Сэжигтэй бол 1800-1111 дугаарт залгаарай!",
    recommendation: "1) Домэйн шалгах: Голомт Банкны жинхэнэ домэйн нь golomtbank.mn — golomtbank-security.org нь хуурамч. 2) Голомт Банк хэзээ ч имэйлээр PIN, карт дугаар асуудаггүй — сэжигтэй бол 1800-1111 дугаарт шууд залга. 3) ₮1,200,000 гадаад гүйлгээ гэх айлган сүрдүүлэлт нь яаралтай арга хэмжээ авахуулах зорилготой — тайвнаар шалга.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 14,
    category: "email_phishing",
    emailFrom: "TDB Bank <notification@tdbbank.mn>",
    emailSubject: "TDB: Таны зээлийн хуулгын мэдэгдэл",
    emailBody: `Сайн байна уу,

Таны TDB кредит картын сарын хуулга бэлэн боллоо.

📅 Хугацаа: 2026 оны 3-р сар

💳 Нийт зарлага: ₮840,000

📆 Төлбөрийн дэдлайн: 2026-04-15`,
    emailUrl: "https://tdbbank.mn/statement",
    isPhish: false,
    explanation: "✅ TDB Банкны жинхэнэ мэдэгдэл — @tdbbank.mn домэйнаас ирсэн. Ямар ч нууц мэдээлэл нэхэхгүй, зөвхөн хуулгын мэдэгдэл.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны notification@tdbbank.mn хаяг ашигласан. 2) Сарын зарлага, төлбөрийн дедлайн тодорхой — нууц мэдээлэл нэхэхгүй. 3) TDB аппаас хуулгаа харах боломжтой — мэдэгдэл тохирч байна.",
    difficulty: 4,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 15,
    category: "url_spoofing",
    emailFrom: "E-Mongolia Засгийн газар <info@e-mongolia-gov.org>",
    emailSubject: "📋 E-Mongolia: Таны иргэний үнэмлэх шинэчлэлт шаардлагатай",
    emailBody: `Таны иргэний үнэмлэхний хугацаа дуусч байна.

📱 E-Mongolia системд шинэчлэхийн тулд доорх мэдээллийг оруулна уу:

• Иргэний үнэмлэхний дугаар

• Регистрийн дугаар

• Нүүр зургийн зураг`,
    emailUrl: "https://e-mongolia-gov.org/renew",
    isPhish: true,
    explanation: "🔍 E-Mongolia-гийн жинхэнэ домэйн нь e-mongolia.mn. Засгийн газар хэзээ ч имэйлээр регистрийн дугаар болон нүүр зураг нэхдэггүй — энэ бол иргэний мэдээллийг хулгайлах луйвар!",
    recommendation: "1) Домэйн шалгах: E-Mongolia-гийн жинхэнэ домэйн нь e-mongolia.mn — e-mongolia-gov.org нь хуурамч. 2) Засгийн газар хэзээ ч имэйлээр регистрийн дугаар, нүүр зураг нэхдэггүй — иргэний мэдээллийг имэйлээр хэзээ ч бүү өг. 3) Иргэний үнэмлэх шинэчлэлт нь зөвхөн e-mongolia.mn сайт эсвэл биечлэн.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+",
    orderIndex: 16,
    category: "email_phishing",
    emailFrom: "Хаан Банк <notification@khanbank.mn>",
    emailSubject: "Хаан Банк: Таны хадгаламжийн хүү нэмэгдлээ",
    emailBody: `Сайн байна уу,

Таны хадгаламжийн данс дахь хүүгийн мэдэгдэл:

💰 Нэмэгдсэн хүү: ₮12,400

📅 Хугацаа: 2026 оны 1-р улирал

🏦 Данс: ****7823

Дэлгэрэнгүй мэдээллийг ХБ апп-аас харна уу.`,
    emailUrl: "https://khanbank.mn/savings",
    isPhish: false,
    explanation: "✅ Хаан Банкны жинхэнэ мэдэгдэл — @khanbank.mn домэйн. Хүүгийн мэдэгдэл энгийн, нэвтрэх мэдээлэл нэхэхгүй, апп руу чиглүүлж байна.",
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны notification@khanbank.mn хаяг ашигласан. 2) Хүүгийн дүн, улирал, данс (****7823) тодорхой — нууц мэдээлэл нэхэхгүй. 3) \"ХБ апп-аас харна уу\" гэж чиглүүлсэн — жинхэнэ банкны мэдэгдлийн загвар.",
    difficulty: 3,
  },
];

async function main() {
  console.log(`Seeding ${QUESTIONS.length} questions...`);

  // Reset existing rows so reseeding is idempotent.
  // Must delete in FK order: answers → tests → questions.
  await db.delete(answers);
  await db.delete(tests);
  await db.delete(questions);

  await db.insert(questions).values(QUESTIONS);

  // Tally by age group for a quick sanity check.
  const counts = new Map<string, { total: number; phish: number }>();
  for (const q of QUESTIONS) {
    const entry = counts.get(q.ageGroup) ?? { total: 0, phish: 0 };
    entry.total += 1;
    if (q.isPhish) entry.phish += 1;
    counts.set(q.ageGroup, entry);
  }

  console.log("Seed complete. Totals by age group:");
  for (const [age, { total, phish }] of [...counts.entries()].sort()) {
    console.log(`  ${age.padEnd(7)}  total=${total}  phish=${phish}  legit=${total - phish}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
