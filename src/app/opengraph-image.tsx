import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Фишинг IQ тест";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 100, fontWeight: 700 }}>🛡️ Фишинг IQ</div>
        <div style={{ fontSize: 40, marginTop: 20, opacity: 0.9 }}>
          Фишинг таних чадварын тест
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.75 }}>
          phishing-iq-quiz.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
