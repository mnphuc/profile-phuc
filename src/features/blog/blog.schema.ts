import { z } from "zod";
import { baseContentSchema, localImage } from "@/lib/mdx/schema";

export const blogFrontmatterSchema = baseContentSchema.extend({
  category: z.string().min(1).max(60),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  cover: localImage.optional(),
  featured: z.boolean().default(false),
});
