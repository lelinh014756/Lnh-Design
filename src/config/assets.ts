/**
 * Registry đường dẫn asset tĩnh trong `public/`.
 * Component dùng logo/ảnh nền/placeholder phải import từ đây thay vì hardcode.
 *
 * TODO(asset): các giá trị dưới đây còn là asset của thương hiệu cũ,
 * chờ bộ nhận diện ECO Farm để thay — chỉ cần sửa tại file này.
 */

export const APP_LOGO = {
  /** Logo vuông, dùng khi sidebar thu gọn và làm favicon-ish. */
  icon: "/logo/vime_logo_icon.png",
  /** Logo ngang kèm slogan — nền sáng. */
  horizontal: "/logo/vime_logo.png",
  /** Logo ngang kèm slogan — nền tối. */
  horizontalDark: "/logo/vime_logo_white.png",
  /** Logo đơn vị phát triển, hiển thị ở footer. */
  lab: "/logo/LogoAureusLab.png",
} as const

/** Ảnh nền/illustration khu vực Auth. */
export const SEO_IMAGES = {
  ogImage: "/images/ogImage.jpg",
} as const

/** Ảnh nền/illustration khu vực Auth. */
export const AUTH_IMAGES = {
  background: "/images/bg-full.png",
  /** Nền full-bleed cho mobile/tablet (portrait). */
  backgroundMobile: "/images/bg-mobile.png",
  decorative: "/images/bg-2.png",
} as const

/** Ảnh thay thế khi thiếu ảnh thật. */
export const FALLBACK_IMAGES = {
  noImage: "/images/no-image.jpg",
  avatar: "/images/no-image.jpg",
} as const

/** Nền trang (portal mobile / tablet). */
export const APP_PAGE_IMAGES = {
  /** Nền trang chủ / nội dung — lá + sầu riêng, tông tối. */
  background: "/images/bg-page.png",
} as const

/**
 * Ảnh landing page.
 *
 * TODO(asset): toàn bộ URL dưới đây là ảnh mượn tạm để dựng UI — hai host
 * `agrezen.zozothemes.com` và `agron.casethemes.net` là trang demo của theme
 * WordPress thương mại, KHÔNG được để lại khi landing lên production.
 * Khi có bộ ảnh ECO Farm, chỉ cần thay giá trị tại đây và gỡ ba host tương ứng
 * khỏi `images.remotePatterns` trong `next.config.ts`.
 */
const AGREZEN = "https://agrezen.zozothemes.com/wp-content/uploads"
const AGRON = "https://agron.casethemes.net/wp-content/uploads"
const VIMEFARM = "https://vimefarm.vn/wp-content/uploads"

export const LANDING_IMAGES = {
  /** Ảnh nền hero, phủ kín section. Là phần tử LCP của trang. */
  heroBackground: `/images/bg-full.png`,
  /** Ba thẻ ảnh nhỏ nổi ở góc hero. Phải là ẢNH CHỤP — bộ thumbnail icon của
   *  nguồn tham chiếu có nền trắng, đặt lên hero tối thành ba mảng trắng nặng. */
  heroCards: [
    `${AGREZEN}/2025/10/about-3.webp`,
    `${AGREZEN}/2025/10/service-5.webp`,
    `${AGREZEN}/2025/10/service-6.webp`,
  ],
  /** Ảnh minh hoạ 8 bước chuỗi giá trị, đúng thứ tự bước 1 → 8. */
  valueChain: [
    `${AGREZEN}/2025/10/service-7.webp`,
    `${AGREZEN}/2025/10/rural.webp`,
    `${AGREZEN}/2025/10/wheat.webp`,
    `${AGREZEN}/2025/10/tractor.webp`,
    `${AGRON}/2025/06/post-41-732x898.webp`,
    `${AGRON}/2025/06/post-2-732x898.webp`,
    `${AGRON}/2025/06/post-4-732x898.webp`,
    `${AGRON}/2025/06/post-7-732x898.webp`,
  ],
  /** Bento 4 trụ cột. */
  pillars: {
    plots: `${VIMEFARM}/ttl.20230801110311.534.jpg`,
    traceability: `${AGRON}/2025/06/post-37-500x480.webp`,
    forecast: `${AGRON}/2025/06/post-33-732x774.webp`,
    materials: `${AGREZEN}/2025/10/about-2.webp`,
  },
  /** Ảnh cho 4 tab vai trò: nông hộ → tổ trưởng → trưởng phòng → ban quản trị. */
  roles: [
    `${VIMEFARM}/ttl.20220425211825.279.jpg`,
    `${VIMEFARM}/ttl.20230407110116.831.jpg`,
    `${VIMEFARM}/ttl.20220506153600.338.jpg`,
    `${VIMEFARM}/ttl.20220502211304.354.jpg`,
  ],
} as const
