import type { HTMLAttributeAnchorTarget } from 'react';
import type { IconName } from '@/components/general/app-icon';
import type { NavReadiness } from './nav-readiness';

/**
 * Mô hình dữ liệu điều hướng.
 *
 * `iconKey` là tên icon lucide (khoá trong `APP_ICONS`),
 * không phải Lucide như repo nguồn.
 */

export type NavPathMatchMode = 'exact' | 'prefix';

export type NavLink = {
  type: 'link';
  key: string;
  /** Khoá tra trong `dict.nav` — mọi nhãn hiển thị phải đi qua từ điển. */
  labelKey: string;
  path: string;
  iconKey?: IconName;
  target?: HTMLAttributeAnchorTarget;
  /**
   * `prefix` (mặc định): active khi pathname bằng path hoặc bắt đầu bằng `path/`.
   * `exact`: chỉ active đúng path — dùng cho mục cha có submenu cùng tiền tố.
   */
  pathMatch?: NavPathMatchMode;
  /**
   * Trạng thái triển khai. Bỏ trống = `done`.
   * Mục chưa có `page.tsx` phải đánh dấu `none` để render vô hiệu hoá thay vì
   * dẫn người dùng tới 404 — sidebar không phải danh mục route.
   */
  readiness?: NavReadiness;
};

export type NavDivider = {
  type: 'divider';
  key: string;
};

/** Nhóm lồng bên trong `NavGroup`. */
export type NavSubGroup = {
  type: 'subgroup';
  key: string;
  labelKey: string;
  iconKey?: IconName;
  children: (NavLink | NavDivider)[];
};

export type NavGroupChild = NavLink | NavDivider | NavSubGroup;

/** Mục cha có submenu bung/thu. */
export type NavGroup = {
  type: 'group';
  key: string;
  labelKey: string;
  iconKey?: IconName;
  defaultPath?: string;
  children: NavGroupChild[];
};

export type NavEntry = NavLink | NavGroup;

export type NavSectionKey = 'menu' | 'production' | 'trade' | 'quality' | 'system' | 'support';

export type NavSection = {
  key: NavSectionKey;
  /** Khoá nhãn nhóm trong `dict.navSections`. Bỏ trống = không hiện tiêu đề. */
  labelKey?: string;
  items: NavEntry[];
};

// ─── Trạng thái active ───────────────────────────────────────────────────────

export function isNavLinkActive(link: NavLink, pathname: string): boolean {
  if (link.pathMatch === 'exact') return pathname === link.path;
  return pathname === link.path || pathname.startsWith(`${link.path}/`);
}

export function isNavEntryActive(entry: NavGroupChild | NavEntry, pathname: string): boolean {
  switch (entry.type) {
    case 'link':
      return isNavLinkActive(entry, pathname);
    case 'group':
    case 'subgroup':
      return entry.children.some((child) => isNavEntryActive(child, pathname));
    default:
      return false;
  }
}
