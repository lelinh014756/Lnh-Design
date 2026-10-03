'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

import { dictionaries } from './compose-dictionary'
import {
  DEFAULT_LOCALE,
  COOKIE_NAME,
  isLocale,
  type Dictionary,
  type Locale,
} from './types'

type Vars = Record<string, string | number>

const interpolate = (template: string, vars?: Vars): string => {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}

interface I18nContextValue {
  locale: Locale
  dict: Dictionary
  setLocale: (locale: Locale) => void
  t: (template: string, vars?: Vars) => string
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  dict: dictionaries[DEFAULT_LOCALE],
  setLocale: () => {},
  t: (template, vars) => interpolate(template, vars),
})

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? DEFAULT_LOCALE,
  )
  const dict = useMemo(() => dictionaries[locale], [locale])
  const t = useCallback(
    (template: string, vars?: Vars) => interpolate(template, vars),
    [],
  )

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!isLocale(newLocale)) return
      document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000`
      setLocaleState(newLocale)
      // Cookie đổi ảnh hưởng tới server component (VD `getDictionary()` trong
      // layout.tsx) — client state tự re-render ngay, nhưng cây server component
      // vẫn giữ locale cũ tới khi F5 nếu thiếu dòng này.
      router.refresh()
    },
    [router],
  )

  return (
    <I18nContext.Provider value={{ locale, dict, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useT = () => useContext(I18nContext)

export type { Dictionary, Locale } from './types'
