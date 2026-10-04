"use client";

import { useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/general/app-icon";

import { ModeToggleButton } from "@/components/general";
import { Button } from "@/components/ui/button";
import { SHOWCASE_NAV } from "@/config/nav/showcase-nav-config";
import { useT } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n/types";
import { LanguageSwitcher } from "@/lib/i18n/language-switcher";
import { cn } from "@/lib/utils";

import { AppLogo } from "../showcase/app-logo";
import { LandingContainer } from "./landing-container";
import { useScrolled } from "./use-scrolled";

/**
 * Header landing.
 *
 * Trong suốt tới khi cuộn qua ngưỡng rồi mới đặc lại — nhưng chỉ đổi `border`
 * và `backdrop`, không đổi chiều cao: đổi chiều cao khi cuộn làm nội dung phía
 * dưới nhảy một nhịp ở đúng lúc người dùng đang đọc.
 */
export function LandingHeaderClient({ nav }: { nav: Dictionary["nav"] }) {
  const scrolled = useScrolled(16);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dict } = useT();
  const t = dict.showcase;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <LandingContainer className="flex h-16 items-center gap-6">
        <AppLogo />

        <nav className="hidden items-center gap-1 md:flex">
          {SHOWCASE_NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent/60 hover:text-foreground"
            >
              {nav[item.labelKey] ?? item.labelKey}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ModeToggleButton />
          <LanguageSwitcher />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/components">{dict.landing.hero.ctaSecondary}</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t.brand}
            aria-expanded={menuOpen}
            className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          >
            {menuOpen ? <AppIcon icon="x" className="size-4.5" /> : <AppIcon icon="menu" className="size-4.5" />}
          </button>
        </div>
      </LandingContainer>

      {menuOpen && (
        <div className="border-t bg-background md:hidden">
          <LandingContainer className="flex flex-col py-2">
            {SHOWCASE_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
              >
                {nav[item.labelKey] ?? item.labelKey}
              </Link>
            ))}
          </LandingContainer>
        </div>
      )}
    </header>
  );
}

export default LandingHeaderClient;
