import { useI18n } from '../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AnnouncementBar() {
  const { t } = useI18n()

  return (
    <div className="relative bg-navy px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <p className="px-20">{t('announcement')}</p>
      <div className="absolute inset-y-0 end-2 flex items-center">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
