import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { ogImageUrl, siteConfig } from "@/config/site"
import { Metadata, Viewport } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { APPEARANCE_INIT_SCRIPT } from "@/config/appearance"
import { Agentation } from "agentation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "shadcn registry",
    "design system",
    "component library",
    "Next.js",
    "Tailwind CSS",
    "AureCook",
  ],
  authors: [{ name: siteConfig.authors.name, url: siteConfig.authors.url }],
  creator: siteConfig.authors.name,
  publisher: siteConfig.copyright.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImageUrl,
        width: 250,
        height: 250,
        alt: siteConfig.name,
      },
    ],
  },
  // favicon.ico / favicon-16x16.png / favicon-32x32.png / favicon-96x96.png
  // trong src/app/ đã được Next.js tự nhận diện qua file convention — không
  // cần khai báo icons thủ công (trước đây trỏ "/icon.png", file không tồn tại).
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale } = await getDictionary()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        {/* Con đầu tiên của <body>, KHÔNG đặt trong <head> — đây là vị trí
            Next.js khuyến nghị cho script chống nháy giao diện chạy trước
            hydrate (cùng cơ chế next-themes dùng cho dark/light). */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />

        {/* Toaster nằm TRONG Providers để nhận theme hiện tại — đặt ngoài thì
            toast luôn hiện theo theme hệ thống, lệch với trang đang xem. */}
        <Providers initialLocale={locale}>
          {children}
          <Toaster />
        </Providers>
        {process.env.NODE_ENV === "development" && (
          <Agentation />
        )}
      </body>
    </html>
  )
}
