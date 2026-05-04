"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "@/store/store";
import { useAppSelector } from "@/store/hooks";

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.classList.toggle("dark", resolved === "dark");
      root.dataset.theme = theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeBridge>{children}</ThemeBridge>
    </Provider>
  );
}
