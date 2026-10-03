"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggleButton } from "@/components/general";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { INTERNAL_NAV, isNavHrefActive, SHOWCASE_NAV } from "@/config/nav/showcase-nav-config";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/lib/i18n/language-switcher";
import { cn } from "@/lib/utils";

import { AppLogo } from "./app-logo";
import { CommandSearch } from "./command-search";
import { GithubLink } from "./github-link";

/**
 * Header của khu vực showcase.
 *
 * `SidebarTrigger` chỉ hiện khi route hiện tại thật sự có sidebar — trang
 * `/docs` hay `/tokens` không có, và một nút thu gọn không thu gọn được gì thì
 * tệ hơn là không có nút.
 */
export function ShowcaseHeader({ hasSidebar = true }: { hasSidebar?: boolean }) {
  const pathname = usePathname();
  const { dict } = useT();
  const nav = dict.nav;
  const t = dict.showcase;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="flex w-full items-center gap-3 px-3 md:gap-5 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {hasSidebar && <SidebarTrigger className="-ml-1 lg:hidden" />}
          <AppLogo />
        </div>

        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {[...SHOWCASE_NAV, ...INTERNAL_NAV].map((item) => {
            const active = isNavHrefActive(item.href, pathname);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                {nav[item.labelKey] ?? item.labelKey}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <CommandSearch />
          <span className="mx-0.5 hidden h-5 w-px bg-border md:block" />
          <ModeToggleButton />
          <LanguageSwitcher />
          <GithubLink label={t.github} />
        </div>
      </div>
    </header>
  );
}

/** Nút thu gọn dùng riêng cho desktop, đặt trong sidebar chứ không trên header. */
export function SidebarCollapseButton({ className }: { className?: string }) {
  const { toggleSidebar, open } = useSidebar();
  const { dict } = useT();
  const t = dict.showcase;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={t.collapseSidebar}
      aria-expanded={open}
      className={cn(
        "grid size-7 place-items-center rounded-md text-muted-foreground",
        "transition-colors duration-150 hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 4v16" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    </button>
  );
}

export default ShowcaseHeader;
