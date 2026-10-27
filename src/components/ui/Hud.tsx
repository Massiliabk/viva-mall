import { useEffect } from 'react'
import { PRODUCTS_BY_ID } from '../../data/products'
import { selectCount, selectTotal, useCartStore } from '../../store/useCartStore'
import { useUiStore } from '../../store/useUiStore'
import { formatPrice } from '../../utils/format'

export function Hud() {
  const locked = useUiStore((s) => s.locked)
  const aimedId = useUiStore((s) => s.aimedProductId)
  const toast = useUiStore((s) => s.toast)
  const clearToast = useUiStore((s) => s.clearToast)

  const inCart = useCartStore((s) => (aimedId ? (s.items[aimedId] ?? 0) : 0))
  const count = useCartStore(selectCount)
  const total = useCartStore(selectTotal)

  const product = aimedId ? PRODUCTS_BY_ID[aimedId] : null

  // Le message de confirmation disparaît après 1,6 s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(clearToast, 1600)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  if (!locked) return null

  return (
    <>
      {/* Carte du produit visé */}
      {product && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 mt-8 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur">
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-emerald-300">
              {formatPrice(product.price)}
              {inCart > 0 && (
                <span className="ml-2 text-gray-300">· {inCart} au panier</span>
              )}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-2xl leading-none font-bold">
              +
            </span>
            <span className="mt-1 text-[10px] text-gray-300">Clic ou E</span>
          </div>
        </div>
      )}

      {/* Résumé du panier */}
      <div className="pointer-events-none absolute top-4 right-4 z-10 rounded-xl bg-black/70 px-4 py-2 text-right text-white backdrop-blur">
        <p className="text-sm font-semibold">
          🛒 {count} article{count > 1 ? 's' : ''} · {formatPrice(total)}
        </p>
        <p className="text-xs text-gray-300">C : ouvrir le panier</p>
      </div>

      {/* Confirmation d'ajout */}
      {toast && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-lg">
          {toast.message}
        </div>
      )}

      {/* Aide */}
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        Clic / E : ajouter · C : panier · Échap : pause
      </p>
    </>
  )
}