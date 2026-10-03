import type { ReactNode } from "react";

import { ShowcaseFooter, ShowcaseShell } from "@/layouts/showcase";

export default function TokensLayout({ children }: { children: ReactNode }) {
  return <ShowcaseShell footer={<ShowcaseFooter />}>{children}</ShowcaseShell>;
}
