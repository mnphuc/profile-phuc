import { z } from "zod";
import { routing } from "@/i18n/routing";

/** Chấp nhận cả "2026-11-17" (chuỗi) lẫn ngày YAML không có dấu nháy. */
export const dateString = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
);

/** Ảnh nội bộ trong /public, ví dụ /images/blog/cover.jpg. */
export const localImage = z
  .string()
  .regex(
    /^\/(?!\/)[\w\-./]+\.(?:png|jpe?g|webp|avif|gif|svg)$/i,
    "Ảnh phải là đường dẫn nội bộ, ví dụ /images/blog/cover.jpg",
  );

export const baseContentSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(320),
  date: dateString,
  updatedAt: dateString.optional(),
  locale: z.enum(routing.locales),
  translationKey: z
    .string()
    .regex(/^[a-z0-9-]+$/, "translationKey chỉ gồm a-z, 0-9 và dấu -"),
  published: z.boolean().default(false),
});
