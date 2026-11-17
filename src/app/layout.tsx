// Root layout chỉ chuyển tiếp children: thẻ <html> nằm trong app/[locale]/layout.tsx
// để thuộc tính `lang` khớp với ngôn ngữ của từng trang.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
