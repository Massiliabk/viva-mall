import { useUiStore } from '../../store/useUiStore'

export function Overlay() {
  const locked = useUiStore((s) => s.locked)
  const cartOpen = useUiStore((s) => s.cartOpen)
  const aimed = useUiStore((s) => s.aimedProductId !== null)

  const showWelcome = !locked && !cartOpen

  return (
    <>
      {/* Écran d'accueil / pause */}
      <div
        className={`absolute inset-0 z-10 items-center justify-center bg-black/60 ${
          showWelcome ? 'flex' : 'hidden'
        }`}
      >
        <div className="max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-emerald-700">Viva Mall</h1>
          <p className="mt-1 text-gray-600">Visite virtuelle 3D</p>

          <button
            id="enter-btn"
            className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Entrer dans le magasin
          </button>

          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Se déplacer : Z Q S D ou flèches
            <br />
            Regarder : souris
            <br />
            Ajouter au panier : clic ou E
            <br />
            Ouvrir le panier : C · Pause : Échap
          </p>
        </div>
      </div>

      {/* Viseur au centre de l'écran */}
      {locked && (
        <div
          className={`pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-black/40 transition-all ${
            aimed ? 'h-3 w-3 bg-emerald-400' : 'h-2 w-2 bg-white/90'
          }`}
        />
      )}
    </>
  )
}