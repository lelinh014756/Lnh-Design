import type { Metadata } from "next";

import { ICON_PROVIDER } from "@/components/general/app-icon";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { IconBrowser } from "@/modules/showcase/components/icon-browser";
import { PageHeader } from "@/modules/showcase/components/page-header";

export const metadata: Metadata = { title: "Icons" };

export default async function IconsPage() {
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-5 py-8 md:px-8 md:py-10">
      <PageHeader
        crumbs={[{ label: dict.icons.title }]}
        title={dict.icons.title}
        description={dict.icons.subtitle.replace("{provider}", ICON_PROVIDER.id)}
      />

      <IconBrowser />
    </div>
  );
}
