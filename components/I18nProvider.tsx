'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dictionaries, type Lang, getBestLang } from '@/lib/i18n'

type Ctx = {
  lang: Lang
  t: (key: string, vars?: Record<string, any>) => string
  setLang: (l: Lang) => void
}

const I18nCtx = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  // Detecta idioma do navegador
  useEffect(() => {
    try {
      const nav = (navigator as any)
      const guess = nav?.languages?.[0] || nav?.language || ''
      setLang(getBestLang(guess))
    } catch {}
  }, [])

  const value = useMemo<Ctx>(() => {
    const t = (key: string, vars?: Record<string, any>) => {
      const dict = dictionaries[lang] || dictionaries.en
      let v: any = (dict as any)[key]
      if (v === undefined) v = (dictionaries.en as any)[key]
      if (v === undefined) return key

      // quando o valor é uma função (ex.: tube_label)
      if (typeof v === 'function') {
        try { return String(v(vars || {})) } catch { return String(v({})) }
      }

      // string com placeholders {var}
      let text = String(v)
      if (vars) {
        for (const [k, val] of Object.entries(vars)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val))
        }
      }
      return text
    }
    return { lang, t, setLang }
  }, [lang])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
