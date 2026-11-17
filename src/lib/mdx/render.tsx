import "server-only";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/shared/mdx-components";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
};

/** Biên dịch MDX ở server (build time). JS trong MDX bị chặn mặc định để an toàn. */
export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
      },
    },
  });
  return content;
}
