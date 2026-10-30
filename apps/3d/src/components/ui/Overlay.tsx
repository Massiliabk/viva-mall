import { useUiStore } from '../../store/useUiStore'
import { enterImmersiveMode, IS_TOUCH } from '../../utils/device'

export function Overlay() {
  const locked = useUiStore((s) => s.locked)
  const cartOpen = useUiStore((s) => s.cartOpen)
  const aimed = useUiStore((s) => s.aimedProductId !== null)
  const lock = useUiStore((s) => s.lock)

  const showWelcome = !locked && !cartOpen

  // Sur ordinateur, PointerLockControls gère le clic ; sur mobile on entre directement
  const enter = () => {
    if (!IS_TOUCH) return
    lock()
    void enterImmersiveMode()
  }

  return (
    <>
      {/* Écran d'accueil / pause */}
      <div
        className={`absolute inset-0 z-10 items-center justify-center bg-black/60 p-3 ${
          showWelcome ? 'flex' : 'hidden'
        }`}
      >
        <div className="max-h-full w-[min(24rem,92vw)] overflow-y-auto rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold text-emerald-700">Viva Mall</h1>
          <p className="mt-1 text-gray-600">Visite virtuelle 3D</p>

          <button
            id="enter-btn"
            onClick={enter}
            className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Entrer dans le magasin
          </button>

          {IS_TOUCH ? (
            <>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Joystick à gauche : avancer
                <br />
                Glisse ton doigt : regarder autour de toi
                <br />
                Bouton + : ajouter le produit visé au panier
                <br />
                🛒 en haut : voir ton panier
              </p>
              <p className="mt-3 text-xs text-amber-600 landscape:hidden">
                Astuce : tourne ton téléphone en mode paysage pour une meilleure visite.
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Se déplacer : Z Q S D ou flèches
              <br />
              Regarder : souris
              <br />
              Ajouter au panier : clic ou E
              <br />
              Ouvrir le panier : C · Pause : Échap
            </p>
          )}
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