"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { setLanguage } from "@/store/store";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Toaster } from "@/components/toast";

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

function LanguageBridge({ children }: { children: React.ReactNode }) {
  const language = useAppSelector((state) => state.ui.language);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored =
      window.localStorage.getItem("koshpilot-language") ||
      window.localStorage.getItem("ledgerai-language");
    if (stored === "en" || stored === "gu" || stored === "hi" || stored === "mr") {
      dispatch(setLanguage(stored));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    window.localStorage.setItem("koshpilot-language", language);
  }, [language]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeBridge>
        <LanguageBridge>
          {children}
          <Toaster />
        </LanguageBridge>
      </ThemeBridge>
    </Provider>
  );
}
