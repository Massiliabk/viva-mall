import { Link } from 'react-router-dom'
import { Glasses } from 'lucide-react'
import { visit3dUrl } from '../lib/config'
import { useI18n } from '../lib/i18n'

// Photo de fond : apps/site/public/images/hero.jpg (le fond bleu s'affiche tant qu'elle n'existe pas)
export function Hero() {
  const { t, locale } = useI18n()

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-primary">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-primary/95 via-primary/80 to-primary/30 rtl:bg-linear-to-l"
        aria-hidden
      />

      <div className="px-6 py-12 sm:px-10 md:px-14 md:py-20 lg:py-28">
        <span className="inline-block rounded-full bg-brand-red px-4 py-1.5 text-sm font-bold tracking-wide text-white">
          {t('hero.badge')}
        </span>

        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {t('hero.title')}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">{t('hero.subtitle')}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={visit3dUrl(locale)}
            className="inline-flex h-14 items-center gap-3 rounded-full bg-brand-red px-7 text-lg font-bold text-white transition hover:brightness-110"
          >
            <Glasses className="size-6" aria-hidden />
            {t('hero.visit')}
          </a>

          <Link
            to="/catalogue"
            className="inline-flex h-14 items-center rounded-full bg-white px-7 text-lg font-bold text-primary transition hover:bg-tint"
          >
            {t('hero.shop')}
          </Link>
        </div>
      </div>
    </section>
  )
}
