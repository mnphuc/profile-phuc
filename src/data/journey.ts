import type { Localized } from "./types";

export type JourneyItem = {
  /** Chuỗi thời gian hiển thị, ví dụ "03/2026 – nay". */
  period: Localized;
  /** Vai trò hoặc giai đoạn/dự án tiêu biểu. */
  title: Localized;
  organization: string;
  description: Localized;
  highlights?: Localized<string[]>;
  current?: boolean;
};

/**
 * Timeline nghề nghiệp (mới nhất ở trên).
 * Bổ sung dự án, trách nhiệm và kết quả cụ thể khi đã được phép công khai.
 */
export const journey: JourneyItem[] = [
  {
    period: { vi: "03/2026 – nay", en: "03/2026 – present" },
    title: { vi: "CTO", en: "CTO" },
    organization: "TechShield",
    current: true,
    description: {
      vi: "Dẫn dắt định hướng công nghệ và phát triển hệ sinh thái sản phẩm phần mềm: nền tảng quản lý license, artifact và hạ tầng phân phối.",
      en: "Leading the technology direction and building a software product ecosystem: license management, artifact and distribution infrastructure platforms.",
    },
  },
  {
    period: { vi: "2024 – 2025", en: "2024 – 2025" },
    title: { vi: "Hệ thống Telecom, Sales & eSIM", en: "Telecom, Sales & eSIM systems" },
    organization: "VISSOFT",
    description: {
      vi: "Tham gia phát triển các hệ thống Telecom, Sales, eSIM và nền tảng phần mềm.",
      en: "Contributed to building telecom, sales and eSIM systems and software platforms.",
    },
  },
  {
    period: { vi: "2020 – 02/2026", en: "2020 – 02/2026" },
    title: { vi: "Software Engineer / Tech Lead", en: "Software Engineer / Tech Lead" },
    organization: "VISSOFT",
    description: {
      vi: "Phát triển phần mềm qua nhiều lĩnh vực như Fintech, Telecom, Affiliate Marketing và các hệ thống quản lý doanh nghiệp; từng bước đảm nhận vai trò Tech Lead.",
      en: "Built software across fintech, telecom, affiliate marketing and enterprise management systems; grew into the Tech Lead role.",
    },
  },
];
