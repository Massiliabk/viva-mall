import { Glasses } from 'lucide-react'
import { visit3dUrl } from '../lib/config'
import { useI18n } from '../lib/i18n'

// Photo de fond : apps/site/public/images/visit-banner.jpg
export function VisitBanner() {
  const { t, locale } = useI18n()

  return (
    <section className="relative isolate mt-12 overflow-hidden rounded-[2rem] bg-primary md:mt-16">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/visit-banner.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-primary/80" aria-hidden />

      <div className="flex flex-col items-center px-6 py-14 text-center text-white md:py-24">
        <h2 className="max-w-4xl text-3xl leading-tight font-extrabold sm:text-5xl lg:text-6xl">
          {t('visit.title')}
        </h2>
        <p className="mt-5 max-w-3xl text-base text-white/90 sm:text-xl">
          {t('visit.subtitle')}
        </p>

        <a
          href={visit3dUrl(locale)}
          className="mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-brand-red px-8 text-lg font-bold transition hover:brightness-110"
        >
          <Glasses className="size-6" aria-hidden />
          {t('visit.cta')}
        </a>
      </div>
    </section>
  )
}
