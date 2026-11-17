import { z } from "zod";
import { baseContentSchema } from "@/lib/mdx/schema";
import { projectStatuses } from "@/features/projects/projects.schema";

export const labFrontmatterSchema = baseContentSchema.extend({
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  status: z.enum(projectStatuses).default("experiment"),
});
