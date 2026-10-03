import type { ReactNode } from "react";

import { ShowcaseFooter, ShowcaseShell } from "@/layouts/showcase";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <ShowcaseShell footer={<ShowcaseFooter />}>{children}</ShowcaseShell>;
}
