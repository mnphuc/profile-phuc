"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";

export type AlternatePaths = Partial<Record<Locale, string>>;

type ContextValue = {
  paths: AlternatePaths | null;
  setPaths: (paths: AlternatePaths | null) => void;
};

const AlternatePathsContext = createContext<ContextValue>({ paths: null, setPaths: () => {} });

export function AlternatePathsProvider({ children }: { children: React.ReactNode }) {
  const [paths, setPaths] = useState<AlternatePaths | null>(null);
  return (
    <AlternatePathsContext.Provider value={{ paths, setPaths }}>
      {children}
    </AlternatePathsContext.Provider>
  );
}

export function useAlternatePaths() {
  return useContext(AlternatePathsContext).paths;
}

/**
 * Trang có slug khác nhau giữa các ngôn ngữ khai báo đường dẫn tương ứng để
 * language switcher dẫn đúng bản dịch (hoặc về trang danh sách nếu chưa có bản dịch).
 */
export function SetAlternatePaths({ paths }: { paths: AlternatePaths }) {
  const { setPaths } = useContext(AlternatePathsContext);
  const serialized = JSON.stringify(paths);

  useEffect(() => {
    setPaths(JSON.parse(serialized) as AlternatePaths);
    return () => setPaths(null);
  }, [serialized, setPaths]);

  return null;
}
