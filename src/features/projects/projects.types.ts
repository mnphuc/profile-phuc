import type { z } from "zod";
import type { Locale } from "@/i18n/routing";
import type { projectFrontmatterSchema, projectStatuses } from "./projects.schema";

export type ProjectStatus = (typeof projectStatuses)[number];
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Project = ProjectFrontmatter & { slug: string; locale: Locale };
