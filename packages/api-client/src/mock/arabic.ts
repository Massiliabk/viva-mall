// Traductions arabes des données de test (à relire par un arabophone)

// Clé = identifiant de la catégorie
export const CATEGORY_AR: Record<string, string> = {
  boissons: 'المشروبات',
  epicerie: 'البقالة',
  'cuisine-petit-dejeuner': 'المطبخ والفطور',
  'biscuits-snacks': 'البسكويت والوجبات الخفيفة',
  hygiene: 'النظافة الشخصية',
  entretien: 'مواد التنظيف',
  'produits-laitiers': 'منتجات الألبان',
  'charcuterie-traiteur': 'اللحوم الباردة والأطباق الجاهزة',
  frais: 'المنتجات الطازجة',
  maison: 'المنزل',
}

// Clé = identifiant du produit
const NAMES: Record<string, string> = {
  eau: 'مياه معدنية 1.5 لتر',
  'jus-orange': 'عصير البرتقال 1 لتر',
  lait: 'حليب معقم 1 لتر',
  soda: 'مشروب غازي 1 لتر',

  semoule: 'سميد 1 كغ',
  pates: 'سباغيتي 500 غ',
  riz: 'أرز 1 كغ',
  sucre: 'سكر 1 كغ',

  huile: 'زيت دوار الشمس 1 لتر',
  tomate: 'معجون الطماطم 200 غ',
  cafe: 'قهوة مطحونة 250 غ',
  the: 'شاي أخضر 100 غ',

  biscuits: 'بسكويت 200 غ',
  chocolat: 'لوح شوكولاتة',
  chips: 'رقائق البطاطس 150 غ',
  gateau: 'كعكة محشوة',

  savon: 'صابون',
  shampooing: 'شامبو 400 مل',
  dentifrice: 'معجون الأسنان',
  papier: 'ورق المرحاض (4 لفات)',

  lessive: 'مسحوق الغسيل 3 كغ',
  vaisselle: 'سائل غسل الأواني 750 مل',
  javel: 'ماء جافيل 1 لتر',
  eponge: 'إسفنج (3 قطع)',

  yaourt: 'زبادي طبيعي',
  fromage: 'جبن في حصص',
  beurre: 'زبدة 250 غ',
  creme: 'كريمة طازجة 200 غ',

  dinde: 'ديك رومي مدخن 200 غ',
  merguez: 'مرقاز 500 غ',
  poulet: 'دجاج متبل 1 كغ',
  oeufs: 'بيض (12 حبة)',
}

export const PRODUCT_AR: Record<string, { name: string; description: string }> =
  Object.fromEntries(
    Object.entries(NAMES).map(([id, name]) => [
      id,
      { name, description: `${name}. الوصف التفصيلي قريبًا.` },
    ]),
  )
