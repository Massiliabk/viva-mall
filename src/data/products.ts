export type Product = {
    id: string
    name: string
    price: number // en DA
    size: [number, number, number] // largeur, hauteur, profondeur (en mètres)
    color: string // couleur provisoire en attendant les vrais modèles/images
  }
  
  export const PRODUCTS: Product[] = [
    // Boissons
    { id: 'eau', name: 'Eau minérale 1,5 L', price: 45, size: [0.1, 0.32, 0.1], color: '#74b9ff' },
    { id: 'jus-orange', name: "Jus d'orange 1 L", price: 150, size: [0.1, 0.22, 0.07], color: '#fdcb6e' },
    { id: 'lait', name: 'Lait UHT 1 L', price: 120, size: [0.1, 0.22, 0.07], color: '#f1f2f6' },
    { id: 'soda', name: 'Boisson gazeuse 1 L', price: 130, size: [0.1, 0.3, 0.1], color: '#d63031' },
  
    // Épicerie
    { id: 'semoule', name: 'Semoule 1 kg', price: 100, size: [0.15, 0.22, 0.08], color: '#f9ca24' },
    { id: 'pates', name: 'Spaghetti 500 g', price: 80, size: [0.1, 0.28, 0.04], color: '#e17055' },
    { id: 'riz', name: 'Riz 1 kg', price: 180, size: [0.15, 0.22, 0.08], color: '#a29bfe' },
    { id: 'sucre', name: 'Sucre 1 kg', price: 110, size: [0.15, 0.2, 0.08], color: '#dfe6e9' },
  
    // Cuisine & petit-déjeuner
    { id: 'huile', name: 'Huile de tournesol 1 L', price: 260, size: [0.1, 0.28, 0.1], color: '#f6e58d' },
    { id: 'tomate', name: 'Concentré de tomate 200 g', price: 90, size: [0.08, 0.1, 0.08], color: '#e74c3c' },
    { id: 'cafe', name: 'Café moulu 250 g', price: 350, size: [0.1, 0.16, 0.06], color: '#6f4e37' },
    { id: 'the', name: 'Thé vert 100 g', price: 150, size: [0.08, 0.12, 0.06], color: '#27ae60' },
  
    // Produits laitiers
    { id: 'yaourt', name: 'Yaourt nature', price: 30, size: [0.06, 0.07, 0.06], color: '#fab1a0' },
    { id: 'fromage', name: 'Fromage en portions', price: 280, size: [0.12, 0.05, 0.12], color: '#ffeaa7' },
    { id: 'beurre', name: 'Beurre 250 g', price: 220, size: [0.12, 0.05, 0.07], color: '#f8e9a1' },
    { id: 'creme', name: 'Crème fraîche 200 g', price: 110, size: [0.08, 0.09, 0.08], color: '#dfe4ea' },
  
    // Biscuits & snacks
    { id: 'biscuits', name: 'Biscuits 200 g', price: 100, size: [0.18, 0.05, 0.1], color: '#e1b12c' },
    { id: 'chocolat', name: 'Tablette de chocolat', price: 150, size: [0.08, 0.16, 0.02], color: '#8d5524' },
    { id: 'chips', name: 'Chips 150 g', price: 120, size: [0.16, 0.26, 0.06], color: '#e55039' },
    { id: 'gateau', name: 'Gâteau fourré', price: 160, size: [0.2, 0.06, 0.12], color: '#b33939' },
  
    // Hygiène
    { id: 'savon', name: 'Savon', price: 70, size: [0.1, 0.05, 0.06], color: '#81ecec' },
    { id: 'shampooing', name: 'Shampooing 400 ml', price: 450, size: [0.07, 0.2, 0.04], color: '#6c5ce7' },
    { id: 'dentifrice', name: 'Dentifrice', price: 250, size: [0.04, 0.16, 0.04], color: '#55efc4' },
    { id: 'papier', name: 'Papier toilette x4', price: 300, size: [0.15, 0.12, 0.15], color: '#f5f6fa' },
  
    // Entretien
    { id: 'lessive', name: 'Lessive 3 kg', price: 800, size: [0.2, 0.3, 0.1], color: '#0652dd' },
    { id: 'vaisselle', name: 'Liquide vaisselle 750 ml', price: 190, size: [0.08, 0.22, 0.05], color: '#1dd1a1' },
    { id: 'javel', name: 'Eau de Javel 1 L', price: 120, size: [0.1, 0.28, 0.06], color: '#48dbfb' },
    { id: 'eponge', name: 'Éponges x3', price: 60, size: [0.1, 0.03, 0.07], color: '#ff9f43' },
  ]
  
  export const PRODUCTS_BY_ID = Object.fromEntries(
    PRODUCTS.map((p) => [p.id, p]),
  ) as Record<string, Product>