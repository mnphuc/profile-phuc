import Link from "next/link";
import "./globals.css";

// Trang 404 cho các đường dẫn nằm ngoài [locale] (hiếm gặp vì proxy luôn thêm tiền tố ngôn ngữ).
export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <main className="max-w-md text-center">
          <p className="font-mono text-sm text-muted">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Không tìm thấy trang · Page not found</h1>
          <p className="mt-6 flex justify-center gap-4 text-sm">
            <Link className="text-accent underline-offset-4 hover:underline" href="/vi">
              Trang chủ
            </Link>
            <Link className="text-accent underline-offset-4 hover:underline" href="/en">
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
