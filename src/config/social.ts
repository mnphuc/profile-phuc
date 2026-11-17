/**
 * Liên kết mạng xã hội và email chính thức.
 *
 * Để trống (`""`) những mục CHƯA được xác nhận — mục trống sẽ tự động bị ẩn
 * khỏi website. Không điền thông tin cá nhân chưa được Phúc đồng ý công khai.
 */
export type SocialKey = "email" | "github" | "linkedin" | "youtube" | "tiktok";

export const socialLinks: Record<SocialKey, { label: string; href: string }> = {
  email: { label: "Email", href: "" }, // ví dụ: "mailto:hello@example.com"
  github: { label: "GitHub", href: "" }, // ví dụ: "https://github.com/<username>"
  linkedin: { label: "LinkedIn", href: "" },
  youtube: { label: "YouTube", href: "" },
  tiktok: { label: "TikTok", href: "" },
};

export function getActiveSocialLinks() {
  return (Object.entries(socialLinks) as [SocialKey, { label: string; href: string }][])
    .filter(([, link]) => link.href.trim() !== "")
    .map(([key, link]) => ({ key, ...link }));
}
