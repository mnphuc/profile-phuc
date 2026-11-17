import type { Localized } from "./types";

/** Cập nhật định kỳ. `updatedAt` hiển thị công khai trên trang Now và Homepage. */
export const now = {
  updatedAt: "2026-11-17",
  items: [
    {
      title: { vi: "Building TechShield", en: "Building TechShield" },
      description: {
        vi: "Phát triển hệ sinh thái sản phẩm phần mềm, nền tảng quản lý license, artifact và hạ tầng phân phối.",
        en: "Building a software product ecosystem: license management, artifact and distribution infrastructure platforms.",
      },
    },
    {
      title: { vi: "Exploring AI", en: "Exploring AI" },
      description: {
        vi: "Thử nghiệm AI Agent, LLM, Claude Code và tự động hóa quy trình phát triển phần mềm.",
        en: "Experimenting with AI agents, LLMs, Claude Code and automating the software development process.",
      },
    },
    {
      title: { vi: "Building Personal Projects", en: "Building Personal Projects" },
      description: {
        vi: "Phát triển sản phẩm, công cụ và ý tưởng công nghệ cá nhân.",
        en: "Building personal products, tools and technology ideas.",
      },
    },
    {
      title: { vi: "Creating Content", en: "Creating Content" },
      description: {
        vi: "Chia sẻ kiến thức, trải nghiệm và hành trình làm sản phẩm trên Blog và YouTube.",
        en: "Sharing knowledge, experience and the product-building journey on the blog and YouTube.",
      },
    },
  ] satisfies { title: Localized; description: Localized }[],
};
