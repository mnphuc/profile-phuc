import { NextResponse, type NextRequest } from "next/server";
import { contactRequestSchema } from "@/features/contact/contact.schema";
import { ContactNotConfiguredError, deliverContactMessage } from "@/features/contact/contact.service";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { createRateLimiter } from "@/lib/utils/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
/** Người thật cần ít nhất vài giây để điền form; bot thường gửi ngay lập tức. */
const MIN_FILL_TIME_MS = 3_000;

const rateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function clientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function json(body: { ok: boolean; error?: string }, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: NextRequest) {
  // Chỉ nhận request từ chính website (chống gửi chéo từ trang khác).
  const origin = request.headers.get("origin");
  if (origin) {
    const allowedHosts = new Set(
      [request.headers.get("x-forwarded-host"), request.headers.get("host"), new URL(siteConfig.url).host].filter(
        Boolean,
      ),
    );
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {}
    if (!allowedHosts.has(originHost)) return json({ ok: false, error: "forbidden" }, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const ip = clientIp(request);
  const { allowed, retryAfter } = rateLimit(ip);
  if (!allowed) {
    return json({ ok: false, error: "rate_limited" }, 429, { "Retry-After": String(retryAfter) });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "payload_too_large" }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = contactRequestSchema.safeParse(payload);
  if (!parsed.success) return json({ ok: false, error: "validation_failed" }, 422);

  const { website, startedAt, ...input } = parsed.data;

  // Honeypot bị điền hoặc gửi quá nhanh → coi là spam, trả về "thành công" để không lộ cơ chế lọc.
  if (website || Date.now() - startedAt < MIN_FILL_TIME_MS) return json({ ok: true });

  const refererLocale = request.headers.get("referer")?.match(/\/(vi|en)(?:\/|$)/)?.[1];
  const locale = routing.locales.find((l) => l === refererLocale) ?? routing.defaultLocale;

  try {
    await deliverContactMessage(input, {
      locale,
      ip,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? "unknown",
    });
    return json({ ok: true });
  } catch (error) {
    if (error instanceof ContactNotConfiguredError) {
      return json({ ok: false, error: "unavailable" }, 503);
    }
    console.error("[contact] Gửi lời nhắn thất bại:", error);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }
}
