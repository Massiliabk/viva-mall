import { Link } from 'react-router-dom'

// Logo provisoire en texte : à remplacer par le logo officiel (SVG)
export function Logo() {
  return (
    <Link to="/" aria-label="Viva Mall" className="text-3xl font-extrabold tracking-tight">
      <span className="text-brand-red">Viva</span>
      <span className="text-primary">Mall</span>
    </Link>
  )
}
