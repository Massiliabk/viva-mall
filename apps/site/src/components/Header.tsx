import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Glasses, Search, ShoppingCart } from 'lucide-react'
import { visit3dUrl } from '../lib/config'
import { useI18n } from '../lib/i18n'
import { useCart } from '../lib/queries'
import { CategoryNav } from './CategoryNav'
import { Logo } from './Logo'

export function Header() {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const { data: cart } = useCart()
  const [term, setTerm] = useState('')
  const count = cart?.itemCount ?? 0

  const onSearch = (event: FormEvent) => {
    event.preventDefault()
    const query = term.trim()
    if (query) navigate(`/recherche?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-3 px-4 pt-4 md:flex-nowrap md:gap-x-6 md:px-6 md:pt-5">
        <Logo />

        <form
          onSubmit={onSearch}
          role="search"
          className="order-last flex h-12 w-full items-center gap-3 rounded-full bg-tint px-5 md:order-none md:h-14 md:flex-1"
        >
          <Search className="size-5 shrink-0 text-navy/60" aria-hidden />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.submit')}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-navy/50"
          />
        </form>

        <div className="ms-auto flex items-center gap-2 md:ms-0 md:gap-3">
          {/* Visite 3D : application viva-mall-3D */}
          <a
            href={visit3dUrl(locale)}
            aria-label={t('header.visit')}
            className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-brand-red px-4 text-sm font-bold text-brand-red transition hover:bg-brand-red hover:text-white md:h-12 md:px-5 md:text-base"
          >
            <Glasses className="size-5" aria-hidden />
            <span className="hidden sm:inline">{t('header.visit')}</span>
          </a>

          <Link
            to="/panier"
            aria-label={t('header.cart')}
            className="relative inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white transition hover:bg-navy md:h-12 md:px-6 md:text-base"
          >
            <ShoppingCart className="size-5" aria-hidden />
            <span className="hidden sm:inline">{t('header.cart')}</span>
            {count > 0 && (
              <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand-red px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <CategoryNav />
    </header>
  )
}
