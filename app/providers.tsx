'use client'
import { I18nProvider } from '@/components/I18nProvider'
import LangSwitcher from '@/components/LangSwitcher'

export default function Providers({ children }: { children: React.ReactNode }){
  return (
    <I18nProvider>
      <LangSwitcher />
      {children}
    </I18nProvider>
  )
}
