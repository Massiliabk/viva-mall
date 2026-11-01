import { Languages } from 'lucide-react'
import { LOCALE_LABELS } from '@viva-mall/shared'
import { useI18n } from '../lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const next = locale === 'fr' ? 'ar' : 'fr'

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      lang={next}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white/90 transition hover:bg-white/15 sm:text-sm"
    >
      <Languages className="size-4" aria-hidden />
      {LOCALE_LABELS[next]}
    </button>
  )
}
