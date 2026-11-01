import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_LOCALE, getDirection, isLocale, type Locale } from '@viva-mall/shared'
import { ar } from './translations/ar'
import { fr, type TranslationKey } from './translations/fr'

const STORAGE_KEY = 'viva-locale'

// Langue de départ : adresse (?lang=ar), sinon choix mémorisé, sinon français
function readInitialLocale(): Locale {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (isLocale(fromUrl)) return fromUrl
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // stockage indisponible : langue par défaut
  }
  return DEFAULT_LOCALE
}

// Lue aussi en dehors de React (client d'API)
let currentLocale: Locale = readInitialLocale()
export function getCurrentLocale() {
  return currentLocale
}

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(currentLocale)

  const setLocale = useCallback((next: Locale) => {
    currentLocale = next
    setLocaleState(next)
  }, [])

  // Langue et sens d'écriture de la page, et mémorisation du choix
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = getDirection(locale)
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignoré
    }
  }, [locale])

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => (locale === 'ar' ? ar[key] : fr[key]),
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n doit être utilisé dans <I18nProvider>')
  return value
}
