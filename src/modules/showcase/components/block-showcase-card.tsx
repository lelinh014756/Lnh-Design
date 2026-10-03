"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BugIcon,
  ChevronDownIcon,
  CodeIcon,
  ExternalLinkIcon,
  InfoIcon,
  MaximizeIcon,
  MinimizeIcon,
  MonitorIcon,
  MoonIcon,
  NetworkIcon,
  RefreshCwIcon,
  SmartphoneIcon,
  SparklesIcon,
  SunIcon,
  TabletIcon,
} from "lucide-react";

import { CopyButton } from "@/components/general/copy-button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  installCommandFor,
  PACKAGE_MANAGERS,
  registryItemName,
  type BlockCatalogItem,
  type PackageManager,
} from "@/config/catalog";
import { reportIssueUrl, siteConfig } from "@/config/site";
import type { DependencyEntry } from "@/lib/registry/dependencies";
import { useT } from "@/lib/i18n/context";
import { hasPreview } from "@/modules/showcase/previews";
import { cn } from "@/lib/utils";

import { BlockSourceView } from "./block-source-view";
import { DependenciesDialog } from "./dependencies-dialog";
import { PreviewFrame, type PreviewViewport } from "./preview-frame";

const VIEWPORTS: { key: PreviewViewport; Icon: typeof MonitorIcon; labelKey: string }[] = [
  { key: "desktop", Icon: MonitorIcon, labelKey: "viewportDesktop" },
  { key: "tablet", Icon: TabletIcon, labelKey: "viewportTablet" },
  { key: "mobile", Icon: SmartphoneIcon, labelKey: "viewportMobile" },
];

const iconClass =
  "grid size-7 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground";

/** Logo X vẽ inline — lucide đã bỏ hết icon thương hiệu, kéo thêm một bộ icon nữa chỉ vì một hình là thừa. */
function XMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
      <path d="M9.52 6.77 15.48 0h-1.41L8.9 5.88 4.77 0H0l6.25 8.9L0 16h1.41l5.46-6.21L11.23 16H16L9.52 6.77ZM7.59 8.98l-.63-.89L1.92 1.04h2.17l4.06 5.7.63.89 5.28 7.41h-2.17L7.59 8.98Z" />
    </svg>
  );
}

function IconAction({
  label,
  onClick,
  href,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  const className = cn(iconClass, active && "bg-accent text-foreground");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={className}>
            {children}
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={className}
          >
            {children}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Prompt cho agent: đủ để nó cài và biết mình vừa cài cái gì.
 *
 * Kèm URL item trong registry vì agent nào đọc được mạng thì lấy thẳng danh
 * sách file và phụ thuộc từ đó, không phải đoán theo tên.
 */
function aiPrompt(item: BlockCatalogItem, command: string, description: string): string {
  const itemUrl = new URL(`r/${item.slug}.json`, siteConfig.url).toString();
  return [
    `Thêm block "${item.name}" từ registry AureCook vào dự án này.`,
    ``,
    `Lệnh cài: ${command}`,
    `Registry item: ${itemUrl}`,
    ``,
    `Mô tả: ${description}`,
  ].join("\n");
}

export interface BlockShowcaseCardProps {
  item: BlockCatalogItem;
  dependencies: DependencyEntry[];
  /** Tiêu đề dẫn về trang chi tiết — bỏ trống khi CHÍNH là trang chi tiết. */
  href?: string;
  kindLabel: string;
}

/**
 * Card một block: chuyển Xem trước ↔ Mã nguồn, toolbar khung xem, lệnh cài.
 *
 * Khung xem vẫn là iframe (khác component render thẳng): block là cả một mảng
 * giao diện — nó có layout riêng, breakpoint riêng, đôi khi cả nền riêng. Đổi
 * viewport ở đây phải đổi bề rộng THẬT thì media query bên trong mới chạy đúng,
 * và đó chỉ iframe làm được.
 *
 * Theme khung xem tách khỏi theme site: kiểm tra block ở chế độ tối không nên
 * bắt người đọc đảo cả trang mình đang đọc.
 */
export function BlockShowcaseCard({ item, dependencies, href, kindLabel }: BlockShowcaseCardProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [manager, setManager] = useState<PackageManager>("pnpm");
  const [expanded, setExpanded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const { dict, locale } = useT();
  const t = dict.showcase;
  const available = hasPreview(item.slug);
  const previewUrl = `/preview/${item.slug}?theme=${theme}`;
  const command = installCommandFor(item, manager);
  const description = item.description[locale];

  // Phóng to là trạng thái của trang, không phải của cửa sổ: Esc phải thoát
  // được, nếu không người dùng bị kẹt trong một khung không có lối ra rõ ràng.
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  const shareUrl = new URL(`blocks/${item.categories[0]}/${item.slug}`, siteConfig.url).toString();
  const shareHref = `https://x.com/intent/post?${new URLSearchParams({
    text: `${item.name} — ${description}`,
    url: shareUrl,
  }).toString()}`;

  return (
    <article
      id={item.slug}
      className={cn(
        "overflow-hidden border bg-card",
        expanded
          ? "fixed inset-0 z-50 flex flex-col rounded-none"
          : "scroll-mt-20 rounded-lg",
      )}
    >
      <header className="flex flex-wrap items-center gap-2 border-b bg-muted/30 px-2.5 py-2">
        <div className="flex items-center rounded-md border bg-background p-0.5">
          {(["preview", "code"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs transition-colors duration-150",
                view === key
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "code" && <CodeIcon className="size-3.5" />}
              {key === "preview" ? t.preview : t.code}
            </button>
          ))}
        </div>

        <Badge variant="outline" className="shrink-0 text-[11px]">
          {kindLabel}
        </Badge>
        {item.isNew && (
          <Badge variant="secondary" className="rounded-4xl px-2 py-0 text-[11px]">
            {t.new}
          </Badge>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(iconClass, "cursor-help")} aria-label={t.aboutBlock}>
                <InfoIcon className="size-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              {description}
            </TooltipContent>
          </Tooltip>

          {view === "preview" && available && (
            <>
              <IconAction
                label={t.toggleDark}
                onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
                active={theme === "dark"}
              >
                {theme === "dark" ? <SunIcon className="size-3.5" /> : <MoonIcon className="size-3.5" />}
              </IconAction>
              <IconAction label={t.refreshPreview} onClick={() => setReloadKey((key) => key + 1)}>
                <RefreshCwIcon className="size-3.5" />
              </IconAction>
              <IconAction
                label={expanded ? t.exitFullscreen : t.fullscreen}
                onClick={() => setExpanded((current) => !current)}
                active={expanded}
              >
                {expanded ? <MinimizeIcon className="size-3.5" /> : <MaximizeIcon className="size-3.5" />}
              </IconAction>
              <IconAction label={t.openNewTab} href={previewUrl}>
                <ExternalLinkIcon className="size-3.5" />
              </IconAction>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <CopyButton
                  value={aiPrompt(item, command, description)}
                  label={t.copyAiPrompt}
                  size="sm"
                  idleIcon={<SparklesIcon className="size-3.5" />}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t.copyAiPrompt}</TooltipContent>
          </Tooltip>

          {dependencies.length > 0 && (
            <DependenciesDialog itemName={registryItemName(item)} dependencies={dependencies}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={t.dependencies}
                    className={cn(iconClass, "w-auto gap-1 px-1.5")}
                  >
                    <NetworkIcon className="size-3.5" />
                    <span className="text-[11px] tabular-nums">{dependencies.length}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t.dependencies}</TooltipContent>
              </Tooltip>
            </DependenciesDialog>
          )}

          <IconAction label={t.shareOnX} href={shareHref}>
            <XMark />
          </IconAction>
          <IconAction label={t.reportIssue} href={reportIssueUrl(registryItemName(item))}>
            <BugIcon className="size-3.5" />
          </IconAction>

          {view === "preview" && available && (
            <div className="hidden items-center rounded-md border bg-background p-0.5 sm:flex">
              {VIEWPORTS.map(({ key, Icon, labelKey }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setViewport(key)}
                      aria-label={t[labelKey as keyof typeof t] as string}
                      aria-pressed={viewport === key}
                      className={cn(
                        "grid size-6 place-items-center rounded-sm transition-colors duration-150",
                        viewport === key
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t[labelKey as keyof typeof t] as string}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          <span className="flex items-center gap-0.5 rounded-md border bg-background py-0.5 pr-0.5 pl-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={t.packageManager}
                className="flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              >
                {manager}
                <ChevronDownIcon className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-28">
                {PACKAGE_MANAGERS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onSelect={() => setManager(option)}
                    className={cn("font-mono text-xs", option === manager && "bg-accent")}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <code className="hidden font-mono text-[11px] text-muted-foreground lg:inline">
              {registryItemName(item)}
            </code>
            <CopyButton value={command} label={t.copyCommand} size="sm" />
          </span>
        </div>
      </header>

      {view === "code" ? (
        <BlockSourceView slug={item.slug} />
      ) : available ? (
        <PreviewFrame
          name={item.slug}
          viewport={viewport}
          theme={theme}
          reloadKey={reloadKey}
          fill={expanded}
          title={item.name}
          className={expanded ? "min-h-0 flex-1" : undefined}
        />
      ) : (
        <div className="flex min-h-56 flex-1 flex-col items-center justify-center gap-1.5 bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">{t.previewPending}</p>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">{t.previewPendingBody}</p>
        </div>
      )}

      {!expanded && (
        <footer className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t px-4 py-3">
          {href ? (
            <Link
              href={href}
              className="font-medium tracking-tight text-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ) : (
            <span className="font-medium tracking-tight text-foreground">{item.name}</span>
          )}
          <p className="min-w-0 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </footer>
      )}
    </article>
  );
}

export default BlockShowcaseCard;
