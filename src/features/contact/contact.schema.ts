import { z } from "zod";

/**
 * Schema dùng chung cho client (React Hook Form) và server (API route).
 * Thông báo lỗi là key i18n trong messages/*.json → contact.form.errors.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(100, "nameRequired"),
  email: z.string().trim().max(200, "emailInvalid").pipe(z.email("emailInvalid")),
  subject: z.string().trim().max(150, "subjectTooLong"),
  message: z.string().trim().min(10, "messageLength").max(5000, "messageLength"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Payload gửi lên API: nội dung form + trường chống spam. */
export const contactRequestSchema = contactSchema.extend({
  /** Honeypot — người dùng thật không nhìn thấy và không điền. */
  website: z.string().max(200).default(""),
  /** Thời điểm form được hiển thị (ms) — dùng để chặn bot gửi quá nhanh. */
  startedAt: z.number().int().nonnegative(),
});
