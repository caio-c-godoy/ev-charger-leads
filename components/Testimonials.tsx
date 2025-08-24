'use client'

import { useI18n } from './I18nProvider'
import { testimonialsData } from '@/lib/i18n'

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div aria-label={`${n} stars`} className="text-amber-500 text-sm">
      {'★'.repeat(n)}
    </div>
  )
}

export function Testimonials() {
  const { lang } = useI18n()
  const items = testimonialsData[lang] || testimonialsData.en

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((it, i) => (
        <article
          key={i}
          className="rounded-xl border bg-white p-5 shadow-soft transition hover:shadow-md"
          aria-label={`testimonial ${i + 1}`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-800">{it.name}</div>
            <div className="text-xs text-slate-500">{it.location}</div>
          </div>

          <div className="mt-2">
            <Stars n={it.rating ?? 5} />
          </div>

          <p className="mt-3 text-slate-700 leading-relaxed">“{it.quote}”</p>
        </article>
      ))}
    </div>
  )
}
