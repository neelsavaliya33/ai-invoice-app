"use client";

import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLanguage } from "@/store/store";
import { TranslationKey, useI18n } from "@/lib/i18n";

const languages = [
  { key: "en", labelKey: "english", short: "EN" },
  { key: "gu", labelKey: "gujarati", short: "ગુ" },
  { key: "hi", labelKey: "hindi", short: "हि" },
  { key: "mr", labelKey: "marathi", short: "म" },
] as const;

export function LanguageToggle() {
  const dispatch = useAppDispatch();
  const activeLanguage = useAppSelector((state) => state.ui.language);
  const { t } = useI18n();
  const active = languages.find((language) => language.key === activeLanguage) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-11">
          <Languages className="h-4 w-4" />
          <span>{active.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.key}
            onClick={() => dispatch(setLanguage(language.key))}
          >
            {t(language.labelKey as TranslationKey)}
            {activeLanguage === language.key ? (
              <span className="ml-auto text-xs text-primary">Active</span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
