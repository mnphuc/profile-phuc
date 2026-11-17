const WORDS_PER_MINUTE = 220;

/** Ước lượng thời gian đọc (phút) từ nội dung MDX thô. */
export function readingTime(source: string) {
  const text = source
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\s]+/g, "w"))
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\-[\]()!|]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
