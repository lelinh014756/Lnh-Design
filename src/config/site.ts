export type SiteConfig = typeof siteConfig;

// Domain thử nghiệm (I.1) — đổi sang `aurecook.aureus.vn` khi công khai nội
// bộ, lúc đó cân nhắc khôi phục `authors.url` về `https://aureus.vn/`.
export const siteConfig = {
  name: "AureCook",
  copyright: {
    name: "AureCook",
    url: "https://aurecook.vercel.app/"
  },
  authors: {
    name: "AureCook",
    url: "https://aurecook.vercel.app/"
  },
  description:
    "Component showcase & registry nội bộ cho hệ sinh thái sản phẩm Aureus.",
  url: "https://aurecook.vercel.app/",
  /** Nguồn duy nhất cho link mã nguồn. */
  repo: "https://github.com/lelinh014756/Aure-Cook-web",
};

export const ogImageUrl = new URL("images/ogImage.jpg", siteConfig.url).toString();
