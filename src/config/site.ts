export type SiteConfig = typeof siteConfig;

// Domain đang chạy trên Vercel. Có domain chính thức thì đổi `url` ở đây và
// `LNHDESIGN_HOMEPAGE` lúc build registry; khi đó cân nhắc khôi phục
// `authors.url` về `https://aureus.vn/`.
export const siteConfig = {
  name: "LnhDesign",
  copyright: {
    name: "LnhDesign",
    url: "https://lnhdesign.vercel.app/"
  },
  authors: {
    name: "LnhDesign",
    url: "https://lnhdesign.vercel.app/"
  },
  description:
    "Component showcase & registry nội bộ cho hệ sinh thái sản phẩm Aureus.",
  url: "https://lnhdesign.vercel.app/",
  /** Nguồn duy nhất cho link mã nguồn. */
  repo: "https://github.com/lelinh014756/Lnh-Design",
};

export const ogImageUrl = new URL("images/ogImage.jpg", siteConfig.url).toString();