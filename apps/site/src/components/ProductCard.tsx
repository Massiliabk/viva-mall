import { useEffect, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { formatPrice, type Product } from '@viva-mall/shared'
import { useI18n } from '../lib/i18n'
import { discountPercent } from '../lib/pricing'
import { useAddToCart } from '../lib/queries'

type ProductCardProps = {
  product: Product
  categoryName?: string
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { t, locale } = useI18n()
  const addToCart = useAddToCart()
  const [justAdded, setJustAdded] = useState(false)

  const discount = discountPercent(product)
  const outOfStock = product.stock <= 0
  const image = product.images[0] // photo importée depuis l'admin

  // La coche de confirmation disparaît après un instant
  useEffect(() => {
    if (!justAdded) return
    const timer = setTimeout(() => setJustAdded(false), 1200)
    return () => clearTimeout(timer)
  }, [justAdded])

  const add = () => addToCart.mutate(product.id, { onSuccess: () => setJustAdded(true) })

  return (
    <article className="flex flex-col rounded-3xl border border-line bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-tint">
        {image && (
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="size-full object-contain p-4"
          />
        )}

        {discount !== null && (
          <span
            dir="ltr"
            className="absolute start-3 top-3 rounded-full bg-brand-red px-3 py-1 text-sm font-bold text-white"
          >
            -{discount}%
          </span>
        )}

        {outOfStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-navy/80 px-3 py-1 text-center text-xs font-semibold text-white">
            {t('product.outOfStock')}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        {categoryName && <p className="text-sm text-navy/60">{categoryName}</p>}
        <h3 className="mt-0.5 line-clamp-2 min-h-12 text-base font-semibold sm:text-lg">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-xl font-extrabold text-primary sm:text-2xl">
              {formatPrice(product.price, locale)}
            </p>
            {product.oldPrice && (
              <p className="text-sm text-navy/50 line-through">
                {formatPrice(product.oldPrice, locale)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={add}
            disabled={outOfStock || addToCart.isPending}
            aria-label={`${t('product.add')} : ${product.name}`}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-40 sm:size-12"
          >
            {justAdded ? <Check className="size-5" /> : <Plus className="size-6" />}
          </button>
        </div>
      </div>
    </article>
  )
}
