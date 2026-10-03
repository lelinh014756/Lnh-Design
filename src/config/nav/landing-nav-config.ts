/**
 * Điều hướng cho bề mặt landing.
 *
 * Cố ý KHÔNG dùng lại `NavSection` của app portal: mô hình đó mang icon,
 * readiness và subgroup lồng nhau để dựng sidebar, còn landing chỉ cần một
 * hàng phẳng cộng một dropdown neo tới các section trong trang chủ.
 *
 * `labelKey` tra trong `dict.landing.nav`.
 */

export type LandingNavItem = {
  key: string;
  labelKey: string;
  href: string;
  /** Khoá mô tả phụ trong `dict.landing.nav`; chỉ hiện ở mục trong panel. */
  descriptionKey?: string;
  /**
   * Đệ quy không giới hạn cấp — `NavMenuBar` bung cấp 1 xuống dưới và các cấp
   * sâu hơn sang ngang, nên thêm tầng chỉ là thêm dữ liệu, không sửa render.
   */
  children?: LandingNavItem[];
};

/** Id của các section trên trang chủ — nguồn duy nhất cho cả neo lẫn markup. */
export const LANDING_SECTION_IDS = {
  hero: 'hero',
  capabilities: 'nang-luc',
  brokerage: 'mo-hinh',
  valueChain: 'chuoi-gia-tri',
  pillars: 'tru-cot',
  operations: 'van-hanh',
  compliance: 'tuan-thu',
  pricing: 'chi-phi',
  roadmap: 'lo-trinh',
  faq: 'faq',
  finalCta: 'bat-dau',
} as const;

const anchor = (id: string) => `/#${id}`;

export const LANDING_NAV: LandingNavItem[] = [
  {
    key: 'solutions',
    labelKey: 'solutions',
    href: anchor(LANDING_SECTION_IDS.valueChain),
    children: [
      { key: 'valueChain', labelKey: 'valueChain', href: anchor(LANDING_SECTION_IDS.valueChain) },
      { key: 'pillars', labelKey: 'pillars', href: anchor(LANDING_SECTION_IDS.pillars) },
      { key: 'operations', labelKey: 'operations', href: anchor(LANDING_SECTION_IDS.operations) },
      { key: 'compliance', labelKey: 'compliance', href: anchor(LANDING_SECTION_IDS.compliance) },
      { key: 'pricing', labelKey: 'pricing', href: anchor(LANDING_SECTION_IDS.pricing) },
    ],
  },
  { key: 'about', labelKey: 'about', href: '/about' },
  { key: 'news', labelKey: 'news', href: '/news' },
  { key: 'contact', labelKey: 'contact', href: '/contact' },
];

/** Cột "Giải pháp" ở footer — cùng nguồn neo với header, không khai lại id. */
export const LANDING_FOOTER_SOLUTIONS: LandingNavItem[] = [
  { key: 'valueChain', labelKey: 'valueChain', href: anchor(LANDING_SECTION_IDS.valueChain) },
  { key: 'pillars', labelKey: 'pillars', href: anchor(LANDING_SECTION_IDS.pillars) },
  { key: 'operations', labelKey: 'operations', href: anchor(LANDING_SECTION_IDS.operations) },
  { key: 'compliance', labelKey: 'compliance', href: anchor(LANDING_SECTION_IDS.compliance) },
  { key: 'pricing', labelKey: 'pricing', href: anchor(LANDING_SECTION_IDS.pricing) },
];

export const LANDING_FOOTER_COMPANY: LandingNavItem[] = [
  { key: 'about', labelKey: 'about', href: '/about' },
  { key: 'news', labelKey: 'news', href: '/news' },
  { key: 'contact', labelKey: 'contact', href: '/contact' },
  { key: 'login', labelKey: 'login', href: '/auth/login' },
];

export const LANDING_LOGIN_HREF = '/auth/login';
