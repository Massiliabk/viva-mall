// Appareil tactile (téléphone, tablette).
// Ajoute ?touch=1 à l'adresse pour tester les commandes tactiles sur ordinateur.
export const IS_TOUCH =
  typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('touch') === '1' ||
    window.matchMedia('(pointer: coarse)').matches)

// Plein écran + paysage (Android). Ignoré silencieusement là où ce n'est pas supporté (iOS).
export async function enterImmersiveMode() {
  try {
    await document.documentElement.requestFullscreen?.()

    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>
    }
    await orientation.lock?.('landscape')
  } catch {
    // Non supporté : la visite continue sans
  }
}