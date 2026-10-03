'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import AppIcon from '@/components/general/app-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { isNavEntryActive, isNavLinkActive, type NavGroupChild, type NavEntry } from '@/config/nav/nav-config';
import { resolveNavReadiness } from '@/config/nav/nav-readiness';

/**
 * Dịch `labelKey` của một mục nav thành chuỗi hiển thị.
 *
 * Component nhận hàm này qua prop thay vì tự gọi từ điển của app: nó được phát
 * hành qua registry, mà repo cài về không nhất thiết có hệ i18n nào — và nếu có
 * thì cũng không phải hệ này. Bỏ trống thì `labelKey` hiện nguyên văn, đủ để
 * chạy được ngay sau khi cài.
 */
export type NavLabelResolver = (labelKey: string) => string;

const identityLabel: NavLabelResolver = (labelKey) => labelKey;

export interface NavItemLabels {
  /** Tooltip cho mục chưa dựng màn hình. */
  readinessNone: string;
}

const DEFAULT_LABELS: NavItemLabels = { readinessNone: 'Screen not built yet' };

function NavLinkItem({
  entry,
  onNavigate,
  resolveLabel = identityLabel,
  labels = DEFAULT_LABELS,
}: {
  entry: Extract<NavEntry, { type: 'link' }>;
  onNavigate?: () => void;
  resolveLabel?: NavLabelResolver;
  labels?: NavItemLabels;
}) {
  const pathname = usePathname();
  const active = isNavLinkActive(entry, pathname);
  const readiness = resolveNavReadiness(entry);
  const label = resolveLabel(entry.labelKey);

  // Mục chưa có màn hình: hiện để thấy lộ trình nhưng không cho bấm vào 404.
  if (readiness === 'none') {
    return (
      <SidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              aria-disabled
              className="cursor-not-allowed opacity-50"
              onClick={(e) => e.preventDefault()}
            >
              {entry.iconKey && <AppIcon icon={entry.iconKey} />}
              <span className="truncate">{label}</span>
              <span className="ml-auto size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">{labels.readinessNone}</TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem onClick={onNavigate}>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={label}
        // sidebar-primary (không phải primary) — để đổi kiểu nền/màu thương hiệu ở
        // AccountNav chi phối đúng màu mục đang active, xem globals.css.
        className="data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:hover:bg-sidebar-primary/90"
      >
        <Link href={entry.path} target={entry.target} title={label}>
          {entry.iconKey && <AppIcon icon={entry.iconKey} />}
          <span className="truncate">{label}</span>
          {readiness !== 'done' && (
            <span className="ml-auto size-1.5 shrink-0 rounded-full bg-amber-500" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavItemRecursive({
  entry,
  onNavigate,
  resolveLabel = identityLabel,
  labels = DEFAULT_LABELS,
}: {
  entry: NavEntry | NavGroupChild;
  onNavigate?: () => void;
  resolveLabel?: NavLabelResolver;
  labels?: NavItemLabels;
}) {
  const pathname = usePathname();

  if (entry.type === 'divider') {
    return <li aria-hidden className="my-1 h-px bg-sidebar-border" />;
  }

  if (entry.type === 'link') {
    return (
      <NavLinkItem entry={entry} onNavigate={onNavigate} resolveLabel={resolveLabel} labels={labels} />
    );
  }

  const active = isNavEntryActive(entry, pathname);
  const groupLabel = resolveLabel(entry.labelKey);

  return (
    <Collapsible asChild defaultOpen={active} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={groupLabel} isActive={active}>
            {entry.iconKey && <AppIcon icon={entry.iconKey} />}
            <span className="truncate">{groupLabel}</span>
            <AppIcon
              icon="chevron-right"
              className={cn(
                'ml-auto transition-transform duration-200',
                'group-data-[state=open]/collapsible:rotate-90',
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {entry.children.map((child) => (
              <NavItemRecursive
                key={child.key}
                entry={child}
                onNavigate={onNavigate}
                resolveLabel={resolveLabel}
                labels={labels}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
