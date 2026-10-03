import { getDictionary } from "@/lib/i18n/get-dictionary";

import { LandingHeaderClient } from "./landing-header-client";

/**
 * Server Component bọc ngoài của header landing.
 *
 * Tách bạch với `landing-header-client.tsx` vì `useScrolled` là hook client —
 * gọi nó trong Server Component ném lỗi ngay khi SSR. Server chỉ nạp `nav` từ
 * dictionary rồi truyền xuống qua prop, không kéo i18n server API vào bundle
 * client.
 */
export async function LandingHeader() {
  const { dict } = await getDictionary();
  return <LandingHeaderClient nav={dict.nav} />;
}

export default LandingHeader;
