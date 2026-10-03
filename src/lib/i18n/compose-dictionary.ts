import enAuth from "./dictionaries/en/auth.json";
import enBlocks from "./dictionaries/en/blocks.json";
import enBreadcrumb from "./dictionaries/en/breadcrumb.json";
import enCommon from "./dictionaries/en/common.json";
import enComponents from "./dictionaries/en/components.json";
import enDocs from "./dictionaries/en/docs.json";
import enHeader from "./dictionaries/en/header.json";
import enIcons from "./dictionaries/en/icons.json";
import enInternal from "./dictionaries/en/internal.json";
import enLanding from "./dictionaries/en/landing.json";
import enNav from "./dictionaries/en/nav.json";
import enNavSections from "./dictionaries/en/nav-sections.json";
import enShowcase from "./dictionaries/en/showcase.json";
import enTemplates from "./dictionaries/en/templates.json";
import enTokens from "./dictionaries/en/tokens.json";
import { defaultDictionaryShape, type Dictionary, type Locale } from "./types";

const viDictionary: Dictionary = defaultDictionaryShape;

const enDictionary: Dictionary = {
  auth: enAuth,
  blocks: enBlocks,
  breadcrumb: enBreadcrumb,
  common: enCommon,
  components: enComponents,
  docs: enDocs,
  header: enHeader,
  icons: enIcons,
  internal: enInternal,
  landing: enLanding,
  nav: enNav,
  navSections: enNavSections,
  showcase: enShowcase,
  templates: enTemplates,
  tokens: enTokens,
};

export const dictionaries: Record<Locale, Dictionary> = {
  vi: viDictionary,
  en: enDictionary,
};

export const composeDictionary = (locale: Locale): Dictionary => dictionaries[locale];
