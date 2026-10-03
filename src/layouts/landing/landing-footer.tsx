import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/get-dictionary";

import { AppLogo } from "../showcase/app-logo";
import { LandingContainer } from "./landing-container";

export async function LandingFooter() {
  const { dict } = await getDictionary();
  const footer = dict.landing.footer;
  const nav = dict.nav;

  const columns = [
    { title: footer.product, links: [["/components", nav.components], ["/blocks", nav.blocks], ["/templates", nav.templates]] },
    { title: footer.resources, links: [["/docs", nav.docs], ["/icons", nav.icons], ["/tokens", nav.tokens]] },
  ] as const;

  return (
    <footer className="border-t bg-background">
      <LandingContainer className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-14">
        <div className="flex flex-col gap-3">
          <AppLogo />
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">{footer.tagline}</p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} className="flex flex-col gap-2.5">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">{column.title}</h3>
            {column.links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </LandingContainer>

      <div className="border-t">
        <LandingContainer className="py-5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. {footer.rights}
        </LandingContainer>
      </div>
    </footer>
  );
}

export default LandingFooter;
