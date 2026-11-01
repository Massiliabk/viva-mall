import { Link } from 'react-router-dom'
import { Hammer } from 'lucide-react'
import { useI18n } from '../lib/i18n'

export function ComingSoonPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <Hammer className="size-12 text-primary" aria-hidden />
      <h1 className="mt-4 text-3xl font-extrabold">{t('soon.title')}</h1>
      <p className="mt-2 text-navy/70">{t('soon.text')}</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:bg-navy"
      >
        {t('soon.back')}
      </Link>
    </div>
  )
}
