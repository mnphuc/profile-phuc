import { z } from "zod";
import { baseContentSchema, localImage } from "@/lib/mdx/schema";

export const projectStatuses = ["active", "building", "experiment", "archived"] as const;

export const projectFrontmatterSchema = baseContentSchema.extend({
  /** Vai trò cá nhân của Phúc trong dự án — bắt buộc để phân biệt rõ với công sức của đội ngũ. */
  role: z.string().min(1).max(120),
  stack: z.array(z.string().min(1).max(40)).max(15).default([]),
  status: z.enum(projectStatuses),
  cover: localImage.optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  links: z
    .object({
      website: z.url().optional(),
      repository: z.url().optional(),
    })
    .default({}),
});
