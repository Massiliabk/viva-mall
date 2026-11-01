import { useI18n } from '../lib/i18n'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-12 border-t border-line bg-white py-8 text-center text-sm text-navy/60">
      © {new Date().getFullYear()} Viva Mall · {t('footer.rights')}
    </footer>
  )
}
