import type { ReactNode } from "react";

import { LandingShell } from "@/layouts/landing";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <LandingShell>{children}</LandingShell>;
}
