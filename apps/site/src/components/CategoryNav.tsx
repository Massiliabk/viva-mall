import { NavLink } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useCategories } from '../lib/queries'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block whitespace-nowrap py-3 text-base font-semibold transition-colors ${
    isActive ? 'text-primary' : 'text-navy/70 hover:text-navy'
  }`

export function CategoryNav() {
  const { t } = useI18n()
  const { data: categories } = useCategories()

  // Menu principal : les catégories sans parent
  const topLevel = (categories ?? [])
    .filter((category) => category.parentId === null)
    .sort((a, b) => a.position - b.position)

  return (
    <nav aria-label="Rayons" className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
      <ul className="flex gap-6 overflow-x-auto md:gap-8 [scrollbar-width:none]">
        <li>
          <NavLink
            to="/promos"
            className="block py-3 text-base font-bold whitespace-nowrap text-brand-red"
          >
            {t('nav.promos')}
          </NavLink>
        </li>

        {topLevel.map((category) => (
          <li key={category.id}>
            <NavLink to={`/catalogue/${category.slug}`} className={linkClass}>
              {category.name}
            </NavLink>
          </li>
        ))}

        <li>
          <NavLink to="/nouveautes" className={linkClass}>
            {t('nav.new')}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
