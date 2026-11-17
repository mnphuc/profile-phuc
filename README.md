# phuc.nhanhieuso.vn

Website cá nhân của Phúc — **Building things that matter.**
Minimal Editorial · Song ngữ Việt / Anh · Static-first.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4, UI primitives theo phong cách shadcn/ui (`components.json` sẵn sàng cho `npx shadcn add`) |
| Nội dung | MDX (`next-mdx-remote/rsc`) + frontmatter validate bằng Zod |
| i18n | next-intl, routing `/vi` · `/en`, proxy tại `src/proxy.ts` |
| Form | React Hook Form + Zod (dùng chung schema client/server) |
| Icons | Lucide React (+ SVG riêng cho logo mạng xã hội) |
| SEO | Metadata API, canonical, hreflang, Open Graph image động, sitemap, robots, JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList) |

## Chạy dự án

```bash
npm install
cp .env.example .env.local   # điền biến môi trường nếu cần
npm run dev                  # http://localhost:3000 → tự chuyển đến /vi
npm run build && npm start   # build production
npm run lint
```

Yêu cầu Node.js 20+.

## Cấu trúc

```text
content/{vi,en}/{blog,projects,lab}/*.mdx   Nội dung bài viết, dự án, thử nghiệm
messages/{vi,en}.json                        Chuỗi giao diện
src/
├── app/[locale]/…                           Routes (home, about, journey, now, blog, topics, projects, lab, contact)
├── app/api/contact/route.ts                 API contact form (validation, honeypot, rate limit)
├── app/sitemap.ts · robots.ts · icon.svg
├── components/{layout,home,blog,projects,shared,ui}
├── features/{blog,projects,lab,contact}     Schema + service theo nghiệp vụ
├── lib/{mdx,seo,i18n,utils}
├── config/{site,navigation,social}.ts
├── data/{profile,journey,now}.ts            Hồ sơ, timeline, trang Now (song ngữ)
├── i18n/{routing,navigation,request}.ts
└── proxy.ts                                 Chuyển "/" → "/vi", thêm tiền tố ngôn ngữ
```

## Viết nội dung

Tạo file MDX trong `content/<locale>/<collection>/<slug>.mdx`. Tên file chính là slug (chỉ `a-z`, `0-9`, `-`).

```mdx
---
title: "Tiêu đề"
description: "Mô tả ngắn (≤ 320 ký tự)"
date: "2026-11-17"
updatedAt: "2026-11-17"     # tùy chọn
locale: "vi"                # phải khớp thư mục
translationKey: "my-post"   # dùng chung giữa bản vi và en
category: "AI"              # blog: tạo trang /topics/ai
tags: [AI, Claude Code]
cover: "/images/blog/x.jpg" # tùy chọn, ảnh trong /public
published: true             # false = bản nháp, không render
featured: false
---
```

- Frontmatter sai → **build thất bại** kèm tên file và trường lỗi.
- Bản dịch: dùng slug riêng cho mỗi ngôn ngữ nhưng **cùng `translationKey`**. Hreflang và nút VI/EN tự liên kết đúng bài.
- Chưa có bản dịch: không tạo file ở ngôn ngữ kia. Nút chuyển ngôn ngữ sẽ dẫn về trang danh sách, không tạo URL giả.
- Dự án (`projects`) có thêm `role` (bắt buộc — vai trò cá nhân), `stack`, `status` (`active | building | experiment | archived`), `order`, `links.website`, `links.repository`.
- Component dùng được trong MDX: `<Callout>`, `<Figure src alt width height caption />` (ảnh tối ưu bằng `next/image`).

## Cập nhật thông tin cá nhân

| Nội dung | File |
|---|---|
| Giới thiệu, sở thích, nguyên tắc, ảnh chân dung | `src/data/profile.ts` (`portrait: "/images/profile/phuc.jpg"`) |
| Timeline nghề nghiệp | `src/data/journey.ts` |
| Trang Now + ngày cập nhật | `src/data/now.ts` |
| Email & mạng xã hội | `src/config/social.ts` — mục để trống sẽ tự ẩn |
| Chuỗi giao diện | `messages/vi.json`, `messages/en.json` |

## Contact form

`POST /api/contact` — validate bằng Zod ở server, honeypot, chặn gửi quá nhanh (< 3s), kiểm tra Origin, giới hạn kích thước body, rate limit 5 lần / 10 phút / IP.

Kênh gửi cấu hình bằng biến môi trường (xem `.env.example`): webhook **hoặc** email qua Resend. Không cấu hình → production trả 503 và form hiển thị thông báo "tạm thời chưa hoạt động".

> Rate limit nằm trong bộ nhớ tiến trình: đủ cho VPS một instance. Trên Vercel (serverless nhiều instance), nên bật thêm Rate Limiting Rule của Cloudflare cho `/api/contact`.

## Triển khai

**Vercel:** import repository, đặt biến môi trường, thêm domain `phuc.nhanhieuso.vn`, trỏ CNAME tại Cloudflare về `cname.vercel-dns.com` (DNS only).

**VPS:** `npm ci && npm run build && npm start` (sau PM2/systemd), đặt Nginx/Caddy phía trước, truyền header `Host`/`X-Forwarded-Host`, bật proxy Cloudflare + SSL Full (strict).

Sau khi deploy: kiểm tra HTTPS, gửi `https://phuc.nhanhieuso.vn/sitemap.xml` lên Google Search Console.

## Ghi chú kỹ thuật

- `cacheComponents` (mặc định của create-next-app 16) được **tắt** để giữ mô hình SSG thuần với `generateStaticParams` — phù hợp website static-first và tương thích next-intl ổn định.
- Font: Inter (có subset tiếng Việt) cho heading + body, Geist Mono cho code. Không dùng Geist Sans cho heading vì chưa hỗ trợ đầy đủ dấu tiếng Việt.
- Security headers cấu hình trong `next.config.ts`. Chưa bật CSP — nên thêm khi đã chốt các script bên thứ ba (GA4…).
