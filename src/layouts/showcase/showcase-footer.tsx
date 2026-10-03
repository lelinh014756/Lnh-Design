import Link from "next/link";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { siteConfig } from "@/config/site";

/**
 * Footer chung của khu vực showcase.
 *
 * Server Component: chỉ có text và link, không có gì tương tác — đẩy sang client
 * là kéo thêm bundle cho không.
 */
export async function ShowcaseFooter() {
  const { dict } = await getDictionary();
  const footer = dict.landing.footer;
  const nav = dict.nav;

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="flex flex-col gap-3 px-5 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:py-5">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {footer.rights}
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/docs" className="transition-colors hover:text-foreground">
            {nav.docs}
          </Link>
          <Link href="/components" className="transition-colors hover:text-foreground">
            {nav.components}
          </Link>
          <Link href="/tokens" className="transition-colors hover:text-foreground">
            {nav.tokens}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default ShowcaseFooter;
