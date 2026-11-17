import "server-only";

import type { ContactInput } from "./contact.schema";

export class ContactNotConfiguredError extends Error {
  constructor() {
    super("Contact delivery is not configured");
  }
}

type DeliveryMeta = { locale: string; ip: string; userAgent: string };

function buildText(input: ContactInput, meta: DeliveryMeta) {
  return [
    `Tên / Name: ${input.name}`,
    `Email: ${input.email}`,
    `Chủ đề / Subject: ${input.subject || "(không có)"}`,
    `Ngôn ngữ / Locale: ${meta.locale}`,
    "",
    input.message,
    "",
    "---",
    `IP: ${meta.ip}`,
    `User-Agent: ${meta.userAgent}`,
  ].join("\n");
}

/** Loại bỏ ký tự xuống dòng để tránh header injection trong tiêu đề email. */
function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Gửi lời nhắn liên hệ. Hỗ trợ hai kênh, cấu hình qua biến môi trường (xem .env.example):
 * 1. CONTACT_WEBHOOK_URL — POST JSON tới webhook (Slack/Discord/Telegram bridge, n8n, Make…).
 * 2. RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL — gửi email qua Resend.
 * Không cấu hình kênh nào: môi trường dev chỉ log ra console; production báo lỗi 503.
 */
export async function deliverContactMessage(input: ContactInput, meta: DeliveryMeta) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const subject = singleLine(`[phuc.nhanhieuso.vn] ${input.subject || `Lời nhắn từ ${input.name}`}`).slice(0, 200);
  const text = buildText(input, meta);

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, subject, text, locale: meta.locale }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    return;
  }

  if (resendKey && to && from) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: input.email, subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[contact] Chưa cấu hình kênh gửi — lời nhắn (dev only):\n" + text);
    return;
  }

  throw new ContactNotConfiguredError();
}
