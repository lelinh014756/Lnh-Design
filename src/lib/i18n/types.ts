import viAuth from "./dictionaries/vi/auth.json";
import viBlocks from "./dictionaries/vi/blocks.json";
import viBreadcrumb from "./dictionaries/vi/breadcrumb.json";
import viCommon from "./dictionaries/vi/common.json";
import viComponents from "./dictionaries/vi/components.json";
import viDocs from "./dictionaries/vi/docs.json";
import viHeader from "./dictionaries/vi/header.json";
import viIcons from "./dictionaries/vi/icons.json";
import viInternal from "./dictionaries/vi/internal.json";
import viLanding from "./dictionaries/vi/landing.json";
import viNav from "./dictionaries/vi/nav.json";
import viNavSections from "./dictionaries/vi/nav-sections.json";
import viShowcase from "./dictionaries/vi/showcase.json";
import viTemplates from "./dictionaries/vi/templates.json";
import viTokens from "./dictionaries/vi/tokens.json";

export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";
export const COOKIE_NAME = "NEXT_LOCALE";

export const isLocale = (value: string): value is Locale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(value);

/**
 * Bản VI vừa là từ điển mặc định vừa là NGUỒN KIỂU cho bản EN — thêm khoá ở VI
 * mà quên EN là lỗi biên dịch, không phải chuỗi trống lúc chạy.
 * `pnpm i18n:check` bắt nốt phần lệch cấu trúc lồng nhau.
 */
export const defaultDictionaryShape = {
  auth: viAuth,
  blocks: viBlocks,
  breadcrumb: viBreadcrumb,
  common: viCommon,
  components: viComponents,
  docs: viDocs,
  header: viHeader,
  icons: viIcons,
  internal: viInternal,
  landing: viLanding,
  nav: viNav,
  navSections: viNavSections,
  showcase: viShowcase,
  templates: viTemplates,
  tokens: viTokens,
} as const;

export type Dictionary = typeof defaultDictionaryShape;
