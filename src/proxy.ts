import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua API, file nội bộ của Next.js và file tĩnh (đường dẫn có dấu chấm, ví dụ favicon.ico).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
