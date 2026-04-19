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
import { questions, answers, tests, inboxBatches, type NewQuestion } from "./schema";
import type { AgeGroup } from "@/lib/constants";

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
    recommendation: "1) Домэйн шалгах: Roblox-ийн жинхэнэ домэйн нь roblox.com — roblox-free-robux.com нь хуурамч. 2) Үнэгүй Robux амлах нь луйварын нийтлэг арга — Roblox хэзээ ч имэйлээр Robux тарааддаггүй. 3) Акаунтын мэдээллийг хэзээ ч бусдад өгч болохгүй — Roblox аппаа нэрвэ, 2FA идэвхжүүл.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@youtube.com хаяг ашигласан. 2) Нууц үг, хувийн мэдээлэл нэхээгүй. 3) Зөвхөн таны захиалсан сувгийн мэдэгдэл — хүлээгдсэн агуулга.",
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
    recommendation: "1) Домэйн шалгах: Minecraft-ийн жинхэнэ домэйн нь minecraft.net — minecraft-gift.net нь хуурамч. 2) \"Тусгайлан сонгогдлоо\" гэдэг нь луйварчдын хамгийн түгээмэл заль мэх. 3) Microsoft акаунтын нэвтрэх мэдээллийг хэзээ ч имэйлээр оруулж болохгүй.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны noreply@discord.com хаяг ашигласан. 2) Нууц үг, нэвтрэх мэдээлэл огт нэхээгүй. 3) Зөвхөн шинэ гишүүний тухай мэдэгдэл — Discord серверийн хүлээгдсэн агуулга.",
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
    recommendation: "1) Домэйн шалгах: TikTok-ийн жинхэнэ домэйн нь tiktok.com — \".xyz\" домэйн нь хуурамч. 2) TikTok баталгаажуулалтыг зөвхөн апп дотроо хийдэг, имэйлээр хэзээ ч биш. 3) 24 цагийн яаралтай хугацаа тавих нь шахалтын арга — сандрах хэрэггүй.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@accounts.google.com хаяг ашигласан. 2) \"Хэрэв энэ та бол юу ч хийх шаардлагагүй\" — нууц мэдээлэл нэхэхгүй. 3) Нэвтрэлтийн байршил, цаг тодорхой — Google-ийн жинхэнэ мэдэгдлийн загвар.",
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
    recommendation: "1) Домэйн шалгах: Steam-ийн жинхэнэ домэйн нь steampowered.com — steam-trade-secure.com нь хуурамч. 2) Steam Guard кодыг хэзээ ч гуравдагч сайтад оруулж болохгүй — зөвхөн Steam апп доторх trade-д л хэрэглэ. 3) Өндөр үнэт item-ийн trade мессеж ирвэл шууд Steam клиентээс баталгаажуул.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@spotify.com хаяг ашигласан. 2) Тодорхой дуусах огноо заасан — хиймэл яаралтай байдал байхгүй. 3) Нууц үг, төлбөрийн мэдээлэл нэхэхгүй — захиалгаа spotify.com дээрээс өөрөө шинэчлэх боломжтой.",
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
    recommendation: "1) Имэйлээр ирсэн програм суулгахаас татгалз — freevpn-pro-download.net зэрэг үл мэдэгдэх домэйн нь хортой код тараадаг. 2) \"1000 хэрэглэгчид л үлдсэн\" гэх хиймэл дутагдал нь шахалтын арга — сандрах хэрэггүй. 3) Найдвартай VPN хэрэгтэй бол app store-оос буюу albан ёсны сайтаас ав.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@accounts.google.com хаяг ашигласан. 2) Файлын нэр, хэмжээ тодорхой — нууц мэдээлэл нэхээгүй. 3) Багшаас ирсэн Google Drive хуваалцалт хүлээгдсэн агуулга — холбоос accounts.google.com руу чиглэж байна.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@accounts.google.com хаяг ашигласан. 2) Акаунт сэргээсний баталгаажуулалт — нууц үг, PIN нэхэхгүй. 3) Google-ийн бренд загвар, хаяг, footer зөв — хүлээгдсэн тохиолдолд ирдэг жинхэнэ имэйл.",
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
    recommendation: "1) Домэйн шалгах: PayPal-ийн жинхэнэ домэйн нь paypal.com — \"paypa1-verify.com\"-д \"l\" үсгийн оронд \"1\" тоо ашигласан (typosquatting). 2) \"24 цаг\" хугацааны аюул заналхийлэл нь хүнийг сандруулж шалгалгүй дарахад хүргэх арга. 3) PayPal аппаа буюу paypal.com-оос шууд нэвтэрч аккаунтаа шалга.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны noreply@github.com хаяг ашигласан. 2) PR дугаар, branch нэр тодорхой — хүлээгдсэн техникийн мэдэгдэл. 3) Нууц үг, токен нэхэхгүй — зөвхөн CI/CD үр дүнгийн мэдэгдэл.",
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
    recommendation: "1) Домэйн шалгах: Apple-ийн жинхэнэ домэйн нь apple.com — apple-id-secure.net нь хуурамч (\".net\" эндүүрэлтэй). 2) \"Москва, 03:47\" айдас төрүүлэх мэдэгдэл нь нийтлэг фишинг тактик. 3) Сэжигтэй бол Apple ID тохиргоог зөвхөн appleid.apple.com-оос шалга.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны no-reply@accounts.google.com хаяг ашигласан. 2) Нэвтрэлтийн байршил, төхөөрөмж, цаг тодорхой. 3) \"Хэрэв энэ та бол юу ч хийх шаардлагагүй\" — нууц мэдээлэл огт нэхэхгүй.",
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
    recommendation: "1) Домэйн шалгах: Amazon-ийн жинхэнэ домэйн нь amazon.com — amazon-delivery-update.co нь хуурамч. 2) Amazon хэзээ ч хүргэлтэд нэмэлт мөнгө нэхдэггүй — захиалгаа amazon.com аппаасаа шалга. 3) \"48 цаг\" хугацааны дарамт нь шахалтын арга — сандрах хэрэггүй.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Албан ёсны feedback@slack.com хаяг ашигласан. 2) Яаралтай байдал, аюул заналхийлэл байхгүй — энгийн ажлын орон зайн урилга. 3) Холбоос slack.com/intl/mn/invites руу чиглэж байна — найдвартай.",
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
    recommendation: "1) Домэйн шалгах: Жинхэнэ IT хэлтэс company-helpdesk.xyz биш, компанийн өөрийн домэйн ашигладаг. 2) \"60 минут!\" экстрем яаралтай байдал нь нийгмийн инженерчлэлийн техник — сандарч шалгалгүй дарахгүй. 3) Нууц үг солих хүсэлт ирвэл IT хэлтэстэй шууд утсаар холбогд, имэйлийн холбоос дээр бүү дар.",
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
    recommendation: "Жинхэнэ имэйлийн шинж: 1) Netflix маркетингийн имэйлдээ mailer.netflix.com ашигладаг — energy ёсны subdomain. 2) Захиалга дуусгавар, нууц мэдээлэл нэхэхгүй — зөвхөн зөвлөмжийн имэйл. 3) Холбоос mailer.netflix.com руу чиглэсэн — хүлээгдсэн агуулга.",
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
    recommendation: "1) Домэйн шалгах: Bank of America-ийн жинхэнэ домэйн нь bankofamerica.com — bofa-secure-notification.com нь хуурамч. 2) Жинхэнэ банк хэзээ ч имэйлээр нэвтрэх мэдээлэл асуудаггүй — сэжигтэй бол банкны 1-800 утасны дугаарт залга. 3) \"2 цаг\" хиймэл дарамт нь сандруулах арга — Bank of America аппаасаа шалга.",
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

// ============================================
// SMS PHISHING (smishing) — 9 items
// ============================================
const smsItems: NewQuestion[] = [
  // ========== 6-18 ==========
  {
    ageGroup: "6-18", orderIndex: 100, category: "sms_smishing", type: "sms",
    content: {
      sender: "+976-9911-2233",
      body: "Өнөөдөр гар утасны тариф чөлөөлөгдсөн! 500₮ урамшуулал авахын тулд энд дар: bit.ly/mn-free",
      url: "https://bit.ly/mn-free",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Утасны номер Монголын стандарттай ч, URL нь богиносгосон 3rd-party (bit.ly). Албан ёсны operator bit.ly-аар линк илгээдэггүй.",
    recommendation: "Богиносгосон URL сэжигтэй. Операторын албан ёсны сайтаас л шалгана уу.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18", orderIndex: 101, category: "sms_smishing", type: "sms",
    content: {
      sender: "Сургууль",
      body: "Хүндэт эцэг эх, 2р анги 'А' ангийн ороход маргаашаас цахим хичээл эхэлнэ. Холбоос: school-gov.mn/online",
      url: "https://school-gov.mn/online",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Domain (`school-gov.mn`) Монголын боловсролын яамны стандарт. Sender-ийн нэр мөн итгэмжтэй.",
    recommendation: "Албан ёсны domain (`.gov.mn`) харагдаж байвал найдвартай.",
    difficulty: 3,
  },
  {
    ageGroup: "6-18", orderIndex: 102, category: "sms_smishing", type: "sms",
    content: {
      sender: "DHL-Delivery",
      body: "Ажилтан Тана! Таны илгээмж дутуу хаягтай. Хаягаа шинэчил: dh1-mn.info/track?id=9911",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Domain нь `dhl.com` биш, үсэг `l` биш `1` (number) — typo-squatting. Хүлээн авагчийн нэр ('Тана') generic.",
    recommendation: "DHL албан ёсны болно гэвэл `dhl.com`-оос л дагана.",
    difficulty: 2,
  },
  // ========== 18-35 ==========
  {
    ageGroup: "18-35", orderIndex: 100, category: "sms_smishing", type: "sms",
    content: {
      sender: "KhanBank",
      body: "Таны картаар 2,450,000₮ гүйлгээ амжилттай. Таны биш бол: khanbank.secure-verify.mn",
      url: "https://khanbank.secure-verify.mn",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Spoof domain: `khanbank.secure-verify.mn` — subdomain trick (үнэн нь `secure-verify.mn`). Том дүнтэй гэсэн urgency.",
    recommendation: "Банкны URL нь `khanbank.mn` байх ёстой. Suspicious subdomain-т итгэхгүй.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35", orderIndex: 101, category: "sms_smishing", type: "sms",
    content: {
      sender: "LotteryMN",
      body: "Баяр хүргэе! Та 5,000,000₮ хожлоо! Шагнал авахын тулд 5000₮-ийн handling fee илгээнэ үү: 9811-9999",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Advance-fee scam. Таныг оролцоогүй сугалаанд хожсон гэж. Fee шаардсан бүхэн хуурамч.",
    recommendation: "Хожлоо гэсэн мессежийн өмнө төлбөр шаардсан бол 100% хууран мэхлэлт.",
    difficulty: 1,
  },
  {
    ageGroup: "18-35", orderIndex: 102, category: "sms_smishing", type: "sms",
    content: {
      sender: "+976-7011-1234",
      body: "Сайн байна уу, та UBGC фестивал-д орохоор уригдсан. Цагийг баталгаажуул: u-fest.mn/confirm",
      url: "https://u-fest.mn/confirm",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Domain нь товч `.mn`, тодорхой URL бүтэц. Phone number sense-тэй.",
    recommendation: "Таны хүлээж буй event бол legitimate. Suspicious URL байхгүй.",
    difficulty: 3,
  },
  // ========== 35-60+ ==========
  {
    ageGroup: "35-60+", orderIndex: 100, category: "sms_smishing", type: "sms",
    content: {
      sender: "НДЕГ",
      body: "Тэтгэвэрийн гүйлгээний мэдээлэл өгөгдлийн санд дутуу. Шинэчлэх: pension-gov.tk/renew",
      url: "https://pension-gov.tk/renew",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "`.tk` нь татвар түгдэх free domain, govt биш. НДЕГ нь `ndeg.gov.mn`-ээр л ажилладаг.",
    recommendation: "Govt сайт `.gov.mn` л байна. TLD-ийг нямбай шалга.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+", orderIndex: 101, category: "sms_smishing", type: "sms",
    content: {
      sender: "Mobicom",
      body: "Эрхэм хэрэглэгч, 20 жилийн ойн хүрээнд 10GB үнэгүй дата! Бүртгүүлэх: mobicom.mn/bonus",
      url: "https://mobicom.mn/bonus",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Domain нь `mobicom.mn` — оператор албан ёсны. Anniversary sales legitimate practice.",
    recommendation: "Албан ёсны `.mn` domain + оператор нэр таарвал итгэмжтэй.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+", orderIndex: 102, category: "sms_smishing", type: "sms",
    content: {
      sender: "+976-7576-8901",
      body: "Улаанбаатар цахилгаан түгээх сүлжээ ХК: Таны хаягт төлбөртэй. Асуудал шалгах: ubtz-mn.com/pay-now",
      url: "https://ubtz-mn.com/pay-now",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Жинхэнэ domain нь `ubt.mn` биш, `ubtz-mn.com` lookalike. Urgency + pay-now trigger.",
    recommendation: "Utility company-ийн албан ёсны сайтыг browser-д шууд бичиж шалга.",
    difficulty: 4,
  },
];

// ============================================
// BROWSER WARNING — 9 items
// ============================================
const browserItems: NewQuestion[] = [
  // 6-18
  {
    ageGroup: "6-18", orderIndex: 200, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://fb.account-login.tk/secure",
      pageTitle: "Facebook — Нэвтрэх",
      warningTriggered: true,
      redirectFrom: "https://facebook.com",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Real domain `facebook.com` биш. `.tk` free TLD + `account-login` subdomain. Browser warning идэвхтэй.",
    recommendation: "Browser warning гарвал `Буцах` эсвэл `Report` даран аюулгүй байгаарай.",
    difficulty: 3,
  },
  {
    ageGroup: "6-18", orderIndex: 201, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      pageTitle: "YouTube",
      warningTriggered: false,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Албан ёсны `youtube.com` domain. HTTPS, standard path.",
    recommendation: "`Үргэлжлүүлэх` зөв хариулт.",
    difficulty: 1,
  },
  {
    ageGroup: "6-18", orderIndex: 202, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://roblox-unlimited-robux.club/generate",
      pageTitle: "Free Robux Generator",
      warningTriggered: true,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "'Free generator' сайтууд бараг 100% хуурамч. `.club` TLD + 'robux generator' = scam.",
    recommendation: "Үнэгүй тоглоомын валют амлаж байгаа сайтад битгий ороорой.",
    difficulty: 1,
  },
  // 18-35
  {
    ageGroup: "18-35", orderIndex: 200, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://xaan-bank.mn.secureservice.biz/login",
      pageTitle: "Хаан Банк - Нэвтрэх",
      warningTriggered: true,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Үндсэн domain нь `secureservice.biz`, `xaan-bank.mn` нь зөвхөн subdomain. Алдаа: `xaan` vs `khan`.",
    recommendation: "URL-ийн арын хэсэгт анхаар: subdomain биш, eTLD+1-г шалга.",
    difficulty: 5,
  },
  {
    ageGroup: "18-35", orderIndex: 201, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://www.linkedin.com/feed/",
      pageTitle: "LinkedIn",
      warningTriggered: false,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Legitimate LinkedIn domain + HTTPS.",
    recommendation: "Үргэлжлүүлэх.",
    difficulty: 1,
  },
  {
    ageGroup: "18-35", orderIndex: 202, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "http://amazn.com/deal-today",
      pageTitle: "Amazon - Today's Deal",
      warningTriggered: true,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Typo-squat: `amazn` biш `amazon`. HTTP (unencrypted). Browser warning зөв идэвхжсэн.",
    recommendation: "URL-ийн typo-г анхаарах. HTTPS биш бол домэйнд бас иттгэхгүй.",
    difficulty: 3,
  },
  // 35-60+
  {
    ageGroup: "35-60+", orderIndex: 200, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://e-mongolia-gov.cn/pension",
      pageTitle: "Монгол улсын тэтгэврийн хэсэг",
      warningTriggered: true,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Монгол Улсын албан ёсны e-Mongolia нь `e-mongolia.mn`. `.cn` TLD Хятад — spoof.",
    recommendation: "Засгийн газрын сайт үргэлж `.gov.mn` эсвэл `.mn` домэйнтой.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+", orderIndex: 201, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://www.tatvar.mn/individual",
      pageTitle: "Татварын Ерөнхий Газар - Иргэн",
      warningTriggered: false,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Албан ёсны Татварын Ерөнхий Газрын домэйн `tatvar.mn`. HTTPS.",
    recommendation: "Үргэлжлүүлэх.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+", orderIndex: 202, category: "url_spoofing", type: "browser",
    content: {
      browserUrl: "https://ndeg.gov.mn.verification-mn.online/login",
      pageTitle: "НДЕГ - Нэвтрэх",
      warningTriggered: true,
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Real NDEG domain `ndeg.gov.mn`, гэтэл энд subdomain trick: real eTLD = `verification-mn.online`.",
    recommendation: "URL-ийн eTLD+1-г сайн уншина: хамгийн баруун талд `.online` байвал govt биш.",
    difficulty: 5,
  },
];

// ============================================
// QR PHISHING — 9 items
// ============================================
const qrItems: NewQuestion[] = [
  // 6-18
  {
    ageGroup: "6-18", orderIndex: 300, category: "url_spoofing", type: "qr",
    content: {
      scenario: "wifi_poster",
      posterImagePath: "/qr-scenarios/wifi-poster.svg",
      qrUrl: "https://free-wifi-mn.tk/connect",
      contextDescription: "Нийтийн газарт 'Free WiFi' гэсэн зарын QR код",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "`.tk` free TLD + 'free-wifi' domain. Public WiFi scam.",
    recommendation: "Олон нийтийн WiFi-г битгий итгэ, QR-г scan-аас өмнө URL-ыг нямбай шалга.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18", orderIndex: 301, category: "url_spoofing", type: "qr",
    content: {
      scenario: "school_canteen",
      posterImagePath: "/qr-scenarios/school-canteen.svg",
      qrUrl: "https://schoolcanteen.edu.mn/menu",
      contextDescription: "Сургуулийн хоолны газрын цэсний QR",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "`.edu.mn` боловсролын domain, menu viewing legitimate.",
    recommendation: "Scan хийж болно.",
    difficulty: 2,
  },
  {
    ageGroup: "6-18", orderIndex: 302, category: "url_spoofing", type: "qr",
    content: {
      scenario: "music_bonus",
      posterImagePath: "/qr-scenarios/music-bonus.svg",
      qrUrl: "https://spotify-premium-free.biz/claim",
      contextDescription: "'Spotify Premium үнэгүй 3 сар' гэсэн зарын QR",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Spotify-ийн жинхэнэ `spotify.com`. `.biz` TLD + 'free premium' = scam.",
    recommendation: "Албан ёсны аппликэйшнээс үнэгүй үйлчилгээ шалга, постероос биш.",
    difficulty: 1,
  },
  // 18-35
  {
    ageGroup: "18-35", orderIndex: 300, category: "url_spoofing", type: "qr",
    content: {
      scenario: "restaurant_menu",
      posterImagePath: "/qr-scenarios/restaurant-menu.svg",
      qrUrl: "https://khan-burger-menu.com-order.ml/pay",
      contextDescription: "Рестораны ширээн дээрх QR код цэс",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "eTLD нь `com-order.ml`, үнэндээ Malaysian `.ml` free TLD. Ресторан QR-аар pay хийдэггүй.",
    recommendation: "Ресторан QR зөвхөн menu-руу холбогдоно, төлбөрийн хуудас руу биш.",
    difficulty: 4,
  },
  {
    ageGroup: "18-35", orderIndex: 301, category: "url_spoofing", type: "qr",
    content: {
      scenario: "crypto_airdrop",
      posterImagePath: "/qr-scenarios/crypto-airdrop.svg",
      qrUrl: "https://claim-bitcoin-mn.xyz/wallet",
      contextDescription: "Нийтийн газарт 'Үнэгүй 0.01 BTC' зар + QR",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Free crypto airdrop = guaranteed scam. `.xyz` TLD + 'claim-bitcoin'.",
    recommendation: "Crypto-ийн үнэгүй tokens scan QR-аар авахгүй. Wallet credentials-ийг өгөх эрсдэл.",
    difficulty: 2,
  },
  {
    ageGroup: "18-35", orderIndex: 302, category: "url_spoofing", type: "qr",
    content: {
      scenario: "parking_fee",
      posterImagePath: "/qr-scenarios/parking-fee.svg",
      qrUrl: "https://parking.ulaanbaatar.mn/pay",
      contextDescription: "Нийслэлийн автомашин зогсоолын төлбөрийн QR",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "`ulaanbaatar.mn` нийслэлийн албан ёсны domain, parking payment бодитой service.",
    recommendation: "Scan хийж болно.",
    difficulty: 3,
  },
  // 35-60+
  {
    ageGroup: "35-60+", orderIndex: 300, category: "url_spoofing", type: "qr",
    content: {
      scenario: "banking_transfer",
      posterImagePath: "/qr-scenarios/banking-transfer.svg",
      qrUrl: "https://khanbank-mn.top/transfer?acc=99112233",
      contextDescription: "'Хамгийн хэрэгтэй хандивт зориулсан QR' зар",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "`.top` TLD биш банкны official. Donation scam via QR. Account number ч prefilled.",
    recommendation: "Хандив өгөх юм бол албан ёсны сайтаас л.",
    difficulty: 3,
  },
  {
    ageGroup: "35-60+", orderIndex: 301, category: "url_spoofing", type: "qr",
    content: {
      scenario: "govt_service",
      posterImagePath: "/qr-scenarios/govt-service.svg",
      qrUrl: "https://e-mongolia.mn/services/health",
      contextDescription: "Эрүүл мэндийн үйлчилгээний QR код",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: false,
    explanation: "Official e-Mongolia platform, subdomain биш legitimate path.",
    recommendation: "Scan хийж болно.",
    difficulty: 2,
  },
  {
    ageGroup: "35-60+", orderIndex: 302, category: "url_spoofing", type: "qr",
    content: {
      scenario: "bus_stop",
      posterImagePath: "/qr-scenarios/bus-stop.svg",
      qrUrl: "https://ub-transport.info/route",
      contextDescription: "Автобусны буудал дахь хуваарийн QR",
    },
    emailFrom: "", emailSubject: "", emailBody: "",
    isPhish: true,
    explanation: "Бодит UB нийтийн тээврийн албан ёсны `ubtrans.mn`. `.info` TLD + fake name.",
    recommendation: "Нийтийн тээврийн QR-ыг албан ёсны app (UBSmart) хэрэглэх.",
    difficulty: 4,
  },
];

// ============================================
// INBOX BATCHES — 9 batches × 5 items each
// ============================================
const inboxBatchesContent: Array<{
  ageGroup: AgeGroup;
  orderIndex: number;
  context: string;
  items: Array<{
    from: string; subject: string; body: string; url?: string;
    isPhish: boolean; explanation: string; recommendation: string;
  }>;
}> = [
  // ===== 6-18 =====
  {
    ageGroup: "6-18", orderIndex: 1, context: "Долоо хоногийн өглөөний inbox",
    items: [
      { from: "teacher@school.edu.mn", subject: "Энэ долоо хоногийн гэрийн даалгавар", body: "Монгол хэлний даалгавар хавсаргаж өглөө.", isPhish: false,
        explanation: ".edu.mn domain, normal content.", recommendation: "OK." },
      { from: "noreply@robloxsecure.tk", subject: "Роблокс: Аюулгүй баталгаажуулалт шаардлагатай", body: "Дансаа баталгаажуулахгүй бол устгагдана. Одоо нэвтэр: robloxsecure.tk", url: "https://robloxsecure.tk", isPhish: true,
        explanation: ".tk + 'secure' + urgency = phish.", recommendation: "Report." },
      { from: "mama@gmail.com", subject: "Үдэш хаана уулзах уу?", body: "Амралтын цагт ресторанд хамт уулзацгаая.", isPhish: false,
        explanation: "Personal email, contextually normal.", recommendation: "OK." },
      { from: "win@gift-draw.online", subject: "Та хонжвор хожсон!", body: "1М ₮ хожлоо! Мэдээлэл өгч шагналыг аваарай: gift-draw.online/claim", url: "https://gift-draw.online/claim", isPhish: true,
        explanation: "'.online' TLD + 'unexpected prize' = scam.", recommendation: "Report." },
      { from: "support@youtube.com", subject: "Таны сэтгэгдэл хариу авлаа", body: "Та сүүлд үлдээсэн comment-т хариу ирлээ.", isPhish: false,
        explanation: "Legitimate YouTube domain, normal notification.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "6-18", orderIndex: 2, context: "Сургуулийн мэдээний inbox",
    items: [
      { from: "admin@school.edu.mn", subject: "Сургуулийн энэ сарын хуралдаан", body: "3 дугаар сарын 15-нд эцэг эхийн хурал болно.", isPhish: false,
        explanation: "Legitimate school domain.", recommendation: "OK." },
      { from: "discord@discordsupport.info", subject: "Nitro үнэгүй — зөвхөн 24 цаг", body: "Discord Nitro-г 3 сарын хугацаатай үнэгүй! discordsupport.info/claim", url: "https://discordsupport.info/claim", isPhish: true,
        explanation: "Discord official бус домэйн.", recommendation: "Report." },
      { from: "classmate@gmail.com", subject: "Reшарлах өгөгдөл", body: "Нэмж reshare хийгэмээр байна уу?", isPhish: false,
        explanation: "Personal, normal.", recommendation: "OK." },
      { from: "security@apple-verify.info", subject: "Apple ID сэжигтэй нэвтрэлт", body: "Apple ID-г баталгаажуулахгүй бол түгжиж авна. Link: apple-verify.info", url: "https://apple-verify.info", isPhish: true,
        explanation: "Apple official нь `apple.com` л.", recommendation: "Report." },
      { from: "newsletter@mongolian-cities.mn", subject: "Улаанбаатарын сонин — өнөөдрийн toim", body: "Нийслэлийн шинжлэх ухаан, соёлын мэдээ.", isPhish: false,
        explanation: "Legitimate newsletter.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "6-18", orderIndex: 3, context: "Тоглоом, нийгмийн сүлжээний inbox",
    items: [
      { from: "no-reply@instagram.com", subject: "Таны пост like цуглуулж байна", body: "Пост чинь 100 like авлаа.", isPhish: false,
        explanation: "Legitimate Instagram.", recommendation: "OK." },
      { from: "help@steam-gift.club", subject: "Steam gift card үнэгүй", body: "Steam-ийн gift card хожно уу? steam-gift.club/win", url: "https://steam-gift.club/win", isPhish: true,
        explanation: "Steam official бус.", recommendation: "Report." },
      { from: "friend@outlook.com", subject: "Энэ сэдвээр эссэ бичих хэрэгтэй", body: "Туслах уу?", isPhish: false,
        explanation: "Peer, normal.", recommendation: "OK." },
      { from: "noreply@tiktok-support.info", subject: "TikTok данс түгжигдлээ", body: "Tiktok данс сэргээх: tiktok-support.info", url: "https://tiktok-support.info", isPhish: true,
        explanation: "TikTok official `tiktok.com`.", recommendation: "Report." },
      { from: "notifications@github.com", subject: "Repo-д шинэ issue", body: "Таны repo-д хариу ирлээ.", isPhish: false,
        explanation: "Legitimate GitHub.", recommendation: "OK." },
    ],
  },
  // ===== 18-35 =====
  {
    ageGroup: "18-35", orderIndex: 1, context: "Ажлын email inbox",
    items: [
      { from: "hr@company.mn", subject: "Сарын тайлан", body: "Сарын ажлын тайлан илгээх сануулга.", isPhish: false,
        explanation: "Legitimate work email.", recommendation: "OK." },
      { from: "admin@it-update-mn.com", subject: "Windows шинэчлэл дутуу", body: "Windows лицензийг сэргээх: it-update-mn.com/license", url: "https://it-update-mn.com/license", isPhish: true,
        explanation: "IT дэмжлэг дотоод домэйноор л холбогдоно.", recommendation: "Report." },
      { from: "invoice@clientco.com", subject: "Төсөл 4-ийн нэхэмжлэх", body: "Х төслийн нэхэмжлэх хавсаргасан.", isPhish: false,
        explanation: "Client email, normal.", recommendation: "OK." },
      { from: "ceo@company-mn.cc", subject: "Яаралтай wire transfer хэрэгтэй", body: "Шуурхай 5000 USD шилжүүлнэ үү.", isPhish: true,
        explanation: "BEC (Business Email Compromise). `.cc` spoof domain.", recommendation: "Report." },
      { from: "team@slack.com", subject: "New message in #dev-team", body: "Шинэ message.", isPhish: false,
        explanation: "Legitimate Slack.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "18-35", orderIndex: 2, context: "Банк, санхүүгийн inbox",
    items: [
      { from: "info@khanbank.mn", subject: "Орлого зарлагын мэдэгдэл", body: "2-р сарын орлого зарлага.", isPhish: false,
        explanation: "Legitimate bank.", recommendation: "OK." },
      { from: "secure@khaanbank-verify.top", subject: "Таны карт хаагдлаа", body: "Карт идэвхжүүлэх: khaanbank-verify.top/unlock", url: "https://khaanbank-verify.top/unlock", isPhish: true,
        explanation: "Typo domain `khaanbank`, `.top` TLD.", recommendation: "Report." },
      { from: "noreply@paypal.com", subject: "Таны PayPal гүйлгээ", body: "15 USD гүйлгээ дуусав.", isPhish: false,
        explanation: "Legitimate PayPal.", recommendation: "OK." },
      { from: "service@golomt-service.xyz", subject: "Голомт банк бонус идэвхжүүлэх", body: "1000 ₮ бонус авахад OTP хэрэгтэй: golomt-service.xyz", url: "https://golomt-service.xyz", isPhish: true,
        explanation: "Golomt official `golomtbank.mn`.", recommendation: "Report." },
      { from: "payroll@employer.mn", subject: "Цалингийн мэдэгдэл", body: "Сарын цалин орсон.", isPhish: false,
        explanation: "Legitimate payroll.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "18-35", orderIndex: 3, context: "E-commerce, subscription inbox",
    items: [
      { from: "orders@amazon.com", subject: "Таны захиалга илгээгдлээ", body: "Order shipped.", isPhish: false,
        explanation: "Legitimate Amazon.", recommendation: "OK." },
      { from: "netflix@netflix-renew.info", subject: "Netflix renewal fail", body: "Төлбөрөө шинэчил: netflix-renew.info", url: "https://netflix-renew.info", isPhish: true,
        explanation: "Netflix-ийн жинхэнэ `netflix.com`.", recommendation: "Report." },
      { from: "hello@ebay.com", subject: "Таны eBay захиалга", body: "Listing confirmed.", isPhish: false,
        explanation: "Legitimate eBay.", recommendation: "OK." },
      { from: "support@shopify-account.cc", subject: "Shopify данс баталгаажуулах", body: "Link: shopify-account.cc", url: "https://shopify-account.cc", isPhish: true,
        explanation: "Shopify official `shopify.com`.", recommendation: "Report." },
      { from: "spotify@spotify.com", subject: "Discover Weekly for you", body: "Weekly playlist ready.", isPhish: false,
        explanation: "Legitimate Spotify.", recommendation: "OK." },
    ],
  },
  // ===== 35-60+ =====
  {
    ageGroup: "35-60+", orderIndex: 1, context: "Төрийн үйлчилгээний inbox",
    items: [
      { from: "noreply@e-mongolia.mn", subject: "Иргэний бүртгэлийн шинэчлэл", body: "Таны бүртгэл шинэчлэгдсэн.", isPhish: false,
        explanation: "Legitimate govt portal.", recommendation: "OK." },
      { from: "pension@ndeg-service.tk", subject: "Тэтгэвэр шинэчлэгдсэн", body: "Мэдээллийг тохируулах: ndeg-service.tk", url: "https://ndeg-service.tk", isPhish: true,
        explanation: ".tk TLD, NDEG official бус.", recommendation: "Report." },
      { from: "hospital@health.gov.mn", subject: "Эрүүл мэндийн үзлэгийн сануулга", body: "Дараагийн цаг 3 сарын 20.", isPhish: false,
        explanation: "Legitimate health service.", recommendation: "OK." },
      { from: "tax@gov-tatvar.cc", subject: "Татварын дутуу төлбөр", body: "Татвараа төлөөгүй байна: gov-tatvar.cc", url: "https://gov-tatvar.cc", isPhish: true,
        explanation: "TatvarUlk official: `tatvar.mn`.", recommendation: "Report." },
      { from: "newsletter@ubanking.mn", subject: "Улсын Хөгжлийн Банкны сүүлийн мэдээ", body: "Сарын тойм.", isPhish: false,
        explanation: "Legitimate newsletter.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "35-60+", orderIndex: 2, context: "Гэр бүлийн, эрүүл мэндийн inbox",
    items: [
      { from: "family@gmail.com", subject: "Амралтын захиалга баталгаажлаа", body: "Ресторанд захиалга хийсэн.", isPhish: false,
        explanation: "Family, normal.", recommendation: "OK." },
      { from: "pharmacy@medicine-mn.info", subject: "Эмийн үнэгүй илгээлт", body: "Эрүүл мэндийн бүтээгдэхүүн үнэгүй: medicine-mn.info", url: "https://medicine-mn.info", isPhish: true,
        explanation: "Unexpected free meds = scam.", recommendation: "Report." },
      { from: "doctor@clinic.mn", subject: "Шинжилгээний хариу", body: "Хариу бэлэн.", isPhish: false,
        explanation: "Legitimate clinic.", recommendation: "OK." },
      { from: "winner@lottery-win.online", subject: "Та хонжворт хожлоо", body: "5M ₮ хожлоо! Аваарай.", isPhish: true,
        explanation: "Lottery scam.", recommendation: "Report." },
      { from: "noreply@facebook.com", subject: "Таны хүүхдийг таньжээ", body: "Photo зурагт таггалаа.", isPhish: false,
        explanation: "Legitimate FB.", recommendation: "OK." },
    ],
  },
  {
    ageGroup: "35-60+", orderIndex: 3, context: "Санхүүгийн ба гэрийн inbox",
    items: [
      { from: "bills@utilities.mn", subject: "Сарын цахилгааны төлбөр", body: "48,000 ₮ төлөх.", isPhish: false,
        explanation: "Legitimate utility.", recommendation: "OK." },
      { from: "loan@bank-credit.cc", subject: "Зээл дутуу, зээл хаана оршиж буй?", body: "Зээлийн статус шалгах: bank-credit.cc", url: "https://bank-credit.cc", isPhish: true,
        explanation: "Суспишес domain.", recommendation: "Report." },
      { from: "insurance@mandal.mn", subject: "Даатгалын сунгалт", body: "Дараагийн жилийн сунгалт.", isPhish: false,
        explanation: "Legitimate insurance.", recommendation: "OK." },
      { from: "fake@microsoft-support.info", subject: "Таны Windows компьютер халдварласан", body: "Manual засах: microsoft-support.info", url: "https://microsoft-support.info", isPhish: true,
        explanation: "Microsoft official `microsoft.com`.", recommendation: "Report." },
      { from: "bank@khanbank.mn", subject: "Шинэчилсэн нөхцөл", body: "Бидний нөхцөл 4 сард шинэчлэгдэнэ.", isPhish: false,
        explanation: "Legitimate bank.", recommendation: "OK." },
    ],
  },
];

async function seedInboxBatch(opts: {
  ageGroup: AgeGroup;
  orderIndex: number;
  context: string;
  items: Array<{
    from: string; subject: string; body: string; url?: string;
    isPhish: boolean; explanation: string; recommendation: string;
  }>;
}) {
  const [batch] = await db.insert(inboxBatches).values({
    ageGroup: opts.ageGroup,
    context: opts.context,
    timeLimitSec: 90,
    orderIndex: opts.orderIndex,
  }).returning();

  const rows: NewQuestion[] = opts.items.map((item, idx) => ({
    ageGroup: opts.ageGroup,
    orderIndex: opts.orderIndex * 100 + idx + 400,
    category: "email_phishing",
    type: "inbox_item",
    batchId: batch.id,
    content: { from: item.from, subject: item.subject, body: item.body, url: item.url },
    emailFrom: item.from,
    emailSubject: item.subject,
    emailBody: item.body,
    emailUrl: item.url ?? null,
    isPhish: item.isPhish,
    explanation: item.explanation,
    recommendation: item.recommendation,
    difficulty: 3,
  }));
  await db.insert(questions).values(rows);
  console.log(`  batch ${batch.id.slice(0, 8)} (${opts.ageGroup}): ${rows.length} items`);
}

async function main() {
  console.log(`Seeding ${QUESTIONS.length} email questions + multi-modal content...`);

  // Reset existing rows so reseeding is idempotent.
  // FK order: answers → tests → questions → inbox_batches.
  await db.delete(answers);
  await db.delete(tests);
  await db.delete(questions);
  await db.delete(inboxBatches);

  await db.insert(questions).values(QUESTIONS);
  console.log(`✓ Seeded ${QUESTIONS.length} email questions`);

  await db.insert(questions).values(smsItems);
  console.log(`✓ Seeded ${smsItems.length} SMS questions`);

  await db.insert(questions).values(browserItems);
  console.log(`✓ Seeded ${browserItems.length} browser warning questions`);

  await db.insert(questions).values(qrItems);
  console.log(`✓ Seeded ${qrItems.length} QR questions`);

  console.log("Seeding inbox batches...");
  for (const batch of inboxBatchesContent) {
    await seedInboxBatch(batch);
  }
  console.log(`✓ Seeded ${inboxBatchesContent.length} inbox batches (${inboxBatchesContent.length * 5} items)`);

  // Tally email questions by age group for sanity check.
  const counts = new Map<string, { total: number; phish: number }>();
  for (const q of QUESTIONS) {
    const entry = counts.get(q.ageGroup) ?? { total: 0, phish: 0 };
    entry.total += 1;
    if (q.isPhish) entry.phish += 1;
    counts.set(q.ageGroup, entry);
  }

  console.log("\nEmail questions by age group:");
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
