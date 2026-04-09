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
import { questions, type NewQuestion } from "./schema";

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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Банк эсвэл үйлчилгээ хэзээ ч нууц үг, PIN, картын дугаар имэйлээр асуудаггүй — албан ёсны апп руу шууд ор.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
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
    recommendation: "Холбоос дээр дарахаасаа өмнө домэйн нэрийг анхааралтай шалга.",
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
    recommendation: "Зөв илгээгч + хүлээгдсэн агуулга = найдвартай.",
    difficulty: 3,
  },
];

async function main() {
  console.log(`Seeding ${QUESTIONS.length} questions...`);

  // Reset existing rows so reseeding is idempotent.
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
