import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const alt = "Phúc – Building things that matter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Ảnh Open Graph mặc định cho mọi trang (trang con có thể ghi đè).
 * Chỉ dùng ký tự Latin cơ bản để không phụ thuộc font tiếng Việt khi render.
 */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#ffffff",
          color: "#171717",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#737373" }}>
          <span>phuc.nhanhieuso.vn</span>
          <span>{locale.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 140, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
            Phúc<span style={{ color: "#2563eb" }}>.</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 48, letterSpacing: -1 }}>
            Building things that matter.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "2px solid #e5e5e5",
            paddingTop: 28,
            fontSize: 24,
            color: "#737373",
          }}
        >
          Software Engineer  ·  Technology Leader  ·  Product Builder
        </div>
      </div>
    ),
    size,
  );
}
