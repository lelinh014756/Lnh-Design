import Link from "next/link";

import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb + tiêu đề + mô tả cho mọi trang showcase.
 *
 * Badge tổng số nằm cạnh H1 chứ không thành một dòng riêng: nó là thuộc tính
 * của cái tiêu đề đang nói tới, tách ra thành dòng riêng thì người đọc phải tự
 * nối lại.
 */
export function PageHeader({
  crumbs,
  title,
  count,
  description,
  actions,
  className,
}: {
  crumbs?: Crumb[];
  title: string;
  count?: number;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {crumbs && crumbs.length > 0 && (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && <ChevronRightIcon className="size-3.5 opacity-60" />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
          {typeof count === "number" && (
            <span className="rounded-4xl border bg-muted/60 px-2.5 py-0.5 text-sm font-medium tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </h1>
        {actions}
      </div>

      {description && (
        <p className="max-w-3xl text-[15px] leading-7 text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}

export default PageHeader;
