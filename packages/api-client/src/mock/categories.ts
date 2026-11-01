import type { Category } from '@viva-mall/shared'

// Rayons du site. Les catégories sans parent forment le menu principal.
// [identifiant, nom, catégorie parente, rayon frais]
type Row = [slug: string, name: string, parent: string | null, fresh: boolean]

const ROWS: Row[] = [
  ['frais', 'Frais', null, true],
  ['produits-laitiers', 'Produits laitiers', 'frais', true],
  ['charcuterie-traiteur', 'Charcuterie & traiteur', 'frais', true],

  ['epicerie', 'Épicerie', null, false],
  ['cuisine-petit-dejeuner', 'Cuisine & petit-déjeuner', 'epicerie', false],
  ['biscuits-snacks', 'Biscuits & snacks', 'epicerie', false],

  ['boissons', 'Boissons', null, false],
  ['hygiene', 'Hygiène', null, false],

  ['maison', 'Maison', null, false],
  ['entretien', 'Entretien', 'maison', false],
]

export const CATEGORIES: Category[] = ROWS.map(
  ([slug, name, parent, fresh], position) => ({
    id: slug,
    slug,
    name,
    parentId: parent,
    fresh,
    position,
  }),
)
