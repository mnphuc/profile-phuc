import type { Localized } from "./types";

/**
 * Thông tin hồ sơ công khai. Chỉ đưa vào đây những gì Phúc đã đồng ý công khai.
 * `portrait`: đường dẫn ảnh chân dung trong /public (ví dụ "/images/profile/phuc.jpg").
 * Để `null` khi chưa có ảnh — website sẽ hiển thị monogram thay thế.
 */
export const profile = {
  name: { vi: "Phúc", en: "Phuc" } satisfies Localized,
  roles: ["Software Engineer", "Technology Leader", "Product Builder"],
  currentRole: { vi: "CTO tại TechShield", en: "CTO at TechShield" } satisfies Localized,
  portrait: null as string | null,

  about: {
    vi: [
      "Tôi bắt đầu hành trình với vai trò Software Developer, trải nghiệm qua nhiều lĩnh vực như Fintech, Telecom, Affiliate Marketing và các hệ thống quản lý doanh nghiệp.",
      "Trong quá trình làm việc, tôi có cơ hội đảm nhận vai trò Tech Lead và hiện tại là CTO tại TechShield.",
      "Tôi thích giải quyết những bài toán kỹ thuật, thiết kế kiến trúc hệ thống, thử nghiệm công nghệ mới và đưa ý tưởng vào thực tế.",
      "Ngoài công việc, tôi dành thời gian nghiên cứu AI, xây dựng các công cụ cá nhân và chia sẻ lại những kinh nghiệm của mình.",
    ],
    en: [
      "I started my journey as a Software Developer and have worked across domains such as fintech, telecom, affiliate marketing and enterprise management systems.",
      "Along the way, I had the opportunity to take on the Tech Lead role, and I am currently the CTO at TechShield.",
      "I enjoy solving technical problems, designing system architecture, experimenting with new technologies and turning ideas into reality.",
      "Outside of work, I spend time researching AI, building personal tools and sharing what I learn.",
    ],
  } satisfies Localized<string[]>,

  message: {
    vi: "Tôi không chỉ nói về công nghệ. Tôi chia sẻ những gì mình đang xây dựng, những vấn đề mình gặp phải và cách mình giải quyết chúng.",
    en: "I don't just talk about technology. I share what I'm building, the problems I run into and how I solve them.",
  } satisfies Localized,

  interests: [
    {
      title: { vi: "Software Engineering", en: "Software Engineering" },
      description: {
        vi: "Viết phần mềm dễ hiểu, dễ bảo trì và đủ tốt để vận hành lâu dài.",
        en: "Writing software that is easy to understand, easy to maintain and good enough to run for the long haul.",
      },
    },
    {
      title: { vi: "System Architecture", en: "System Architecture" },
      description: {
        vi: "Thiết kế hệ thống phù hợp với bài toán thực tế, không phức tạp hơn mức cần thiết.",
        en: "Designing systems that fit the real problem, and no more complex than they need to be.",
      },
    },
    {
      title: { vi: "AI & Automation", en: "AI & Automation" },
      description: {
        vi: "Ứng dụng AI Agent, LLM và tự động hóa vào quy trình phát triển phần mềm.",
        en: "Applying AI agents, LLMs and automation to the software development process.",
      },
    },
    {
      title: { vi: "Product Building", en: "Product Building" },
      description: {
        vi: "Biến ý tưởng thành sản phẩm thực tế, có người dùng và tạo ra giá trị.",
        en: "Turning ideas into real products that have users and create value.",
      },
    },
  ] satisfies { title: Localized; description: Localized }[],

  principles: [
    {
      vi: "Bắt đầu nhỏ, ra mắt sớm và cải tiến liên tục.",
      en: "Start small, ship early and keep improving.",
    },
    {
      vi: "Chọn giải pháp đơn giản nhất giải quyết được vấn đề.",
      en: "Choose the simplest solution that solves the problem.",
    },
    {
      vi: "Chia sẻ trải nghiệm thật, có ví dụ và kết quả cụ thể.",
      en: "Share real experience, with concrete examples and results.",
    },
    {
      vi: "Tôn trọng dữ liệu và bí mật của công ty, khách hàng.",
      en: "Respect the data and confidentiality of companies and clients.",
    },
  ] satisfies Localized[],
};
