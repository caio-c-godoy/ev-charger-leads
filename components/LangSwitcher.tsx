'use client'
import { useI18n } from './I18nProvider'

const flags: Record<string, string> = { en: '🇺🇸', pt: '🇧🇷', es: '🇪🇸' }

export default function LangSwitcher(){
  const { lang, setLang } = useI18n()
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border bg-white/90 px-2 py-1 shadow-soft backdrop-blur">
      {(['en','pt','es'] as const).map(l => (
        <button
          key={l}
          onClick={()=>setLang(l)}
          aria-label={l}
          className={`text-xl leading-none ${lang===l ? '' : 'opacity-60 hover:opacity-100'}`}
          title={l.toUpperCase()}
        >
          {flags[l]}
        </button>
      ))}
    </div>
  )
}
