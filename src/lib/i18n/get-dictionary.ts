import { dictionaries } from "./compose-dictionary";
import { getLocaleFromCookie } from "./get-locale-from-cookie";
import type { Dictionary, Locale } from "./types";

export async function getDictionary(): Promise<{
  dict: Dictionary;
  locale: Locale;
}> {
  const locale = await getLocaleFromCookie();

  return {
    dict: dictionaries[locale],
    locale,
  };
}
