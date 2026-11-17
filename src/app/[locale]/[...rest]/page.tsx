import { notFound } from "next/navigation";

// Mọi đường dẫn không khớp route nào trong [locale] → hiển thị not-found theo ngôn ngữ.
export default function CatchAllPage() {
  notFound();
}
