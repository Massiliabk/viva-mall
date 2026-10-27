import { PRODUCTS_BY_ID } from '../../data/products'
import { selectCount, selectTotal, useCartStore } from '../../store/useCartStore'
import { useUiStore } from '../../store/useUiStore'
import { formatPrice } from '../../utils/format'

export function CartPanel() {
  const locked = useUiStore((s) => s.locked)
  const cartOpen = useUiStore((s) => s.cartOpen)

  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeOne = useCartStore((s) => s.removeOne)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)
  const count = useCartStore(selectCount)
  const total = useCartStore(selectTotal)

  const visible = cartOpen && !locked
  const entries = Object.entries(items)

  return (
    <div
      className={`absolute inset-0 z-20 justify-end bg-black/50 ${
        visible ? 'flex' : 'hidden'
      }`}
    >
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-xl font-bold text-emerald-700">Mon panier</h2>
          <span className="text-sm text-gray-500">
            {count} article{count > 1 ? 's' : ''}
          </span>
        </header>

        <ul className="flex-1 divide-y overflow-y-auto px-5">
          {entries.length === 0 && (
            <li className="py-10 text-center text-gray-500">
              Votre panier est vide.
            </li>
          )}

          {entries.map(([id, quantity]) => {
            const product = PRODUCTS_BY_ID[id]
            return (
              <li key={id} className="flex items-center gap-3 py-3">
                <span
                  className="h-10 w-10 shrink-0 rounded-md"
                  style={{ backgroundColor: product.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeOne(id)}
                    className="h-7 w-7 rounded-full border text-lg leading-none hover:bg-gray-100"
                    aria-label="Retirer un article"
                  >
                    −
                  </button>
                  <span className="w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => addItem(id)}
                    className="h-7 w-7 rounded-full border text-lg leading-none hover:bg-gray-100"
                    aria-label="Ajouter un article"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Supprimer du panier"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>

        <footer className="space-y-3 border-t px-5 py-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            id="resume-btn"
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Reprendre la visite
          </button>

          <button
            onClick={clear}
            disabled={count === 0}
            className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Vider le panier
          </button>
        </footer>
      </aside>
    </div>
  )
}