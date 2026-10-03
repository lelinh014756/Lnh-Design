"use client";

import { CheckIcon, GlobeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/context";
import { type Locale, SUPPORTED_LOCALES } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

interface LocaleMeta {
  label: string;
  short: string;
}

/** Tên ngôn ngữ luôn hiển thị bằng chính ngôn ngữ đó nên không đưa vào dictionary. */
const LOCALE_META: Record<Locale, LocaleMeta> = {
  vi: { label: "Tiếng Việt", short: "VI" },
  en: { label: "English", short: "EN" },
};

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useT();
  const active = LOCALE_META[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className={cn("gap-1.5 rounded-md px-2", className)}
          aria-label={`Ngôn ngữ: ${active.label}`}
        >
          <GlobeIcon className="size-4" aria-hidden="true" />
          <span className="font-medium text-xs tracking-tight">
            {active.short}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <DropdownMenuItem
            key={supportedLocale}
            onSelect={() => setLocale(supportedLocale)}
          >
            <span className="flex-1">{LOCALE_META[supportedLocale].label}</span>
            {supportedLocale === locale ? (
              <CheckIcon className="size-4 opacity-70" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
