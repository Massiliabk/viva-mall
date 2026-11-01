import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* Catalogue, promos, recherche, panier... : pages à venir */}
        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  )
}
