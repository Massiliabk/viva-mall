import { useI18n } from '../lib/i18n'
import { useCategories, useProducts } from '../lib/queries'
import { ProductCard } from './ProductCard'

export function DealsSection() {
  const { t } = useI18n()
  const { data, isPending, isError, refetch } = useProducts({
    onSale: true,
    pageSize: 8,
    sort: 'newest',
  })
  const { data: categories } = useCategories()

  const categoryName = (id: string) => categories?.find((c) => c.id === id)?.name

  return (
    <section className="mt-12 md:mt-16">
      <p className="text-sm font-bold tracking-wide text-brand-red uppercase">
        {t('deals.eyebrow')}
      </p>
      <h2 className="mt-1 text-3xl font-extrabold text-navy md:text-5xl">
        {t('deals.title')}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {isPending &&
          Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-tint" />
          ))}

        {data?.items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categoryName={categoryName(product.categoryId)}
          />
        ))}
      </div>

      {isError && (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center">
          <p>{t('error.loading')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-full bg-primary px-5 py-2 font-semibold text-white"
          >
            {t('error.retry')}
          </button>
        </div>
      )}
    </section>
  )
}
