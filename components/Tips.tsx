'use client'
import { useI18n } from './I18nProvider'
import { dictionaries } from '@/lib/i18n'

function Card({
  title, icon, items, accent='sky'
}: { title: string; icon: React.ReactNode; items: string[]; accent?: 'sky'|'indigo'|'emerald' }) {
  const accents = {
    sky:     'from-sky-500 to-cyan-500 border-sky-200',
    indigo:  'from-indigo-500 to-violet-500 border-indigo-200',
    emerald: 'from-emerald-500 to-teal-500 border-emerald-200',
  }[accent]

  return (
    <div className="card-glass relative overflow-hidden border p-5">
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-10 ${accents}`} />
      <div className="mb-3 flex items-center gap-2">
        <div className={`grid h-9 w-9 place-content-center rounded-full bg-gradient-to-br text-white shadow ${accents}`}>
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  )
}

export default function Tips(){
  const { t, lang } = useI18n()
  const d = dictionaries[lang] || dictionaries.en

  const best   = (d.tips_best_items   || []) as string[]
  const quick  = (d.tips_quick_items  || []) as string[]
  const prep   = (d.tips_prepare_items|| []) as string[]

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Card
        title={d.tips_best_title || 'Best practices'}
        icon={<span>⭐</span>}
        items={best}
        accent="emerald"
      />
      <Card
        title={d.tips_quick_title || 'Quick checklist'}
        icon={<span>✅</span>}
        items={quick}
        accent="sky"
      />
      <Card
        title={d.tips_prepare_title || 'Prepare for the visit'}
        icon={<span>🧰</span>}
        items={prep}
        accent="indigo"
      />
    </div>
  )
}
