/** Tạo slug ASCII từ chuỗi có dấu tiếng Việt. "Kiến trúc phần mềm" → "kien-truc-phan-mem". */
export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
