import { toCentimes, type Category, type Product } from '@viva-mall/shared'

/* ---------- Outils ---------- */

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Image de remplacement (SVG) en attendant les vraies photos des produits
function placeholderImage(name: string, color: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="${color}"/>` +
    `<rect x="40" y="210" width="520" height="180" fill="white" fill-opacity="0.92"/>` +
    `<text x="300" y="300" text-anchor="middle" dominant-baseline="middle" ` +
    `font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#1f2937">` +
    `${escapeXml(name)}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/* ---------- Catégories ---------- */
// Dans ces données de test, l'identifiant d'une catégorie ou d'un produit est son nom court.
// Le vrai backend utilisera des identifiants uniques générés par la base de données.

const CATEGORY_ROWS: [slug: string, name: string, fresh: boolean][] = [
  ['boissons', 'Boissons', false],
  ['epicerie', 'Épicerie', false],
  ['cuisine-petit-dejeuner', 'Cuisine & petit-déjeuner', false],
  ['biscuits-snacks', 'Biscuits & snacks', false],
  ['hygiene', 'Hygiène', false],
  ['entretien', 'Entretien', false],
  ['produits-laitiers', 'Produits laitiers', true],
  ['charcuterie-traiteur', 'Charcuterie & traiteur', true],
]

export const CATEGORIES: Category[] = CATEGORY_ROWS.map(
  ([slug, name, fresh], position) => ({
    id: slug,
    slug,
    name,
    parentId: null,
    fresh,
    position,
  }),
)

/* ---------- Produits ---------- */

type Row = [
  id: string,
  name: string,
  category: string,
  priceDA: number,
  size: [number, number, number], // largeur, hauteur, profondeur (m)
  color: string,
]

const ROWS: Row[] = [
  // Boissons
  ['eau', 'Eau minérale 1,5 L', 'boissons', 45, [0.1, 0.32, 0.1], '#74b9ff'],
  ['jus-orange', "Jus d'orange 1 L", 'boissons', 150, [0.1, 0.22, 0.07], '#fdcb6e'],
  ['lait', 'Lait UHT 1 L', 'boissons', 120, [0.1, 0.22, 0.07], '#f1f2f6'],
  ['soda', 'Boisson gazeuse 1 L', 'boissons', 130, [0.1, 0.3, 0.1], '#d63031'],

  // Épicerie
  ['semoule', 'Semoule 1 kg', 'epicerie', 100, [0.15, 0.22, 0.08], '#f9ca24'],
  ['pates', 'Spaghetti 500 g', 'epicerie', 80, [0.1, 0.28, 0.04], '#e17055'],
  ['riz', 'Riz 1 kg', 'epicerie', 180, [0.15, 0.22, 0.08], '#a29bfe'],
  ['sucre', 'Sucre 1 kg', 'epicerie', 110, [0.15, 0.2, 0.08], '#dfe6e9'],

  // Cuisine & petit-déjeuner
  ['huile', 'Huile de tournesol 1 L', 'cuisine-petit-dejeuner', 260, [0.1, 0.28, 0.1], '#f6e58d'],
  ['tomate', 'Concentré de tomate 200 g', 'cuisine-petit-dejeuner', 90, [0.08, 0.1, 0.08], '#e74c3c'],
  ['cafe', 'Café moulu 250 g', 'cuisine-petit-dejeuner', 350, [0.1, 0.16, 0.06], '#6f4e37'],
  ['the', 'Thé vert 100 g', 'cuisine-petit-dejeuner', 150, [0.08, 0.12, 0.06], '#27ae60'],

  // Biscuits & snacks
  ['biscuits', 'Biscuits 200 g', 'biscuits-snacks', 100, [0.18, 0.05, 0.1], '#e1b12c'],
  ['chocolat', 'Tablette de chocolat', 'biscuits-snacks', 150, [0.08, 0.16, 0.02], '#8d5524'],
  ['chips', 'Chips 150 g', 'biscuits-snacks', 120, [0.16, 0.26, 0.06], '#e55039'],
  ['gateau', 'Gâteau fourré', 'biscuits-snacks', 160, [0.2, 0.06, 0.12], '#b33939'],

  // Hygiène
  ['savon', 'Savon', 'hygiene', 70, [0.1, 0.05, 0.06], '#81ecec'],
  ['shampooing', 'Shampooing 400 ml', 'hygiene', 450, [0.07, 0.2, 0.04], '#6c5ce7'],
  ['dentifrice', 'Dentifrice', 'hygiene', 250, [0.04, 0.16, 0.04], '#55efc4'],
  ['papier', 'Papier toilette x4', 'hygiene', 300, [0.15, 0.12, 0.15], '#f5f6fa'],

  // Entretien
  ['lessive', 'Lessive 3 kg', 'entretien', 800, [0.2, 0.3, 0.1], '#0652dd'],
  ['vaisselle', 'Liquide vaisselle 750 ml', 'entretien', 190, [0.08, 0.22, 0.05], '#1dd1a1'],
  ['javel', 'Eau de Javel 1 L', 'entretien', 120, [0.1, 0.28, 0.06], '#48dbfb'],
  ['eponge', 'Éponges x3', 'entretien', 60, [0.1, 0.03, 0.07], '#ff9f43'],

  // Produits laitiers
  ['yaourt', 'Yaourt nature', 'produits-laitiers', 30, [0.06, 0.07, 0.06], '#fab1a0'],
  ['fromage', 'Fromage en portions', 'produits-laitiers', 280, [0.12, 0.05, 0.12], '#ffeaa7'],
  ['beurre', 'Beurre 250 g', 'produits-laitiers', 220, [0.12, 0.05, 0.07], '#f8e9a1'],
  ['creme', 'Crème fraîche 200 g', 'produits-laitiers', 110, [0.08, 0.09, 0.08], '#dfe4ea'],

  // Charcuterie & traiteur
  ['dinde', 'Dinde fumée 200 g', 'charcuterie-traiteur', 450, [0.16, 0.1, 0.11], '#f4a6a6'],
  ['merguez', 'Merguez 500 g', 'charcuterie-traiteur', 650, [0.2, 0.1, 0.12], '#c0392b'],
  ['poulet', 'Poulet mariné 1 kg', 'charcuterie-traiteur', 900, [0.22, 0.12, 0.14], '#f6c26b'],
  ['oeufs', 'Œufs x12', 'charcuterie-traiteur', 400, [0.2, 0.12, 0.15], '#d9b382'],
]

// Promotions et stocks particuliers, pour tester les cas limites
const OVERRIDES: Record<string, { stock?: number; oldPriceDA?: number }> = {
  huile: { oldPriceDA: 290 },
  cafe: { oldPriceDA: 400 },
  yaourt: { oldPriceDA: 35 },
  javel: { stock: 0 },
  merguez: { stock: 3 },
}

export const PRODUCTS: Product[] = ROWS.map(
  ([id, name, category, priceDA, size, color]) => {
    const override = OVERRIDES[id]
    return {
      id,
      sku: `VM-${id.toUpperCase()}`,
      slug: slugify(name),
      name,
      description: `${name}. Description détaillée à venir.`,
      categoryId: category,
      price: toCentimes(priceDA),
      oldPrice: override?.oldPriceDA ? toCentimes(override.oldPriceDA) : null,
      stock: override?.stock ?? 50,
      isActive: true,
      images: [
        { id: `${id}-1`, url: placeholderImage(name, color), alt: name, position: 0 },
      ],
      model3d: { size, color, frontImageUrl: null },
    }
  },
)
