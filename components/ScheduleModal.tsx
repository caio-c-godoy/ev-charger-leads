'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { money } from '@/lib/estimate'
import { useI18n } from './I18nProvider'

type Props = {
  open: boolean
  onClose: () => void
  fullName: string
  email: string
  phone: string
  address: string
  proType: 'experienced' | 'licensed'
  distanceFt: number
  estimateJson: any
  chargerModel?: string
  carModel?: string
}

// Somente 08:00–17:00 (10 slots de 1h)
const workingSlots = Array.from({ length: 10 }, (_, i) =>
  `${String(i + 8).padStart(2, '0')}:00`
)

export default function ScheduleModal(p: Props) {
  const { t } = useI18n()
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [busy, setBusy] = useState<string[]>([])
  const [slot, setSlot] = useState<string>('')

  useEffect(() => {
    if (!p.open) return
    fetch(`/api/booked?date=${date}`)
      .then(r => r.json())
      .then(d => {
        const b = Array.isArray(d?.busy) ? d.busy : []
        setBusy(b)
        if (b.includes(slot)) setSlot('')
      })
      .catch(() => setBusy([]))
  }, [p.open, date])

  const canConfirm = useMemo(
    () => !!p.fullName && !!p.phone && !!date && !!slot,
    [p.fullName, p.phone, date, slot]
  )

  async function confirm() {
    if (!canConfirm) return
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        date, time: slot,
        fullName: p.fullName,
        email: p.email,
        phone: p.phone,
        address: p.address,
        proType: p.proType,
        distanceFt: p.distanceFt,
        chargerModel: p.chargerModel || '',
        carModel: p.carModel || '',
        estimate: p.estimateJson,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data?.error || 'Could not book this time. Try another slot.')
      return
    }
    alert('Appointment scheduled! You will receive a confirmation.')
    p.onClose() // fecha apenas o modal; não limpa o formulário
  }

  // Fallback simples se a chave não existir no i18n
  const f = (en: string, pt: string, es: string) =>
    t(en) === en ? pt : t(en)

  return (
    <Modal open={p.open} onClose={p.onClose} title={t('schedule_title') || f('Schedule installation', 'Agendar instalação', 'Agendar instalación')}>
      <div className="space-y-4 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <span>{t('total_estimate') || f('Estimated total', 'Total estimado', 'Total estimado')}</span>
            <span className="font-semibold">{money(p.estimateJson.total)}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {t('disclaimer') ||
              'Automatic estimate. Final value may vary after on-site assessment and specific requirements (amperage, permits, drilling, etc.).'}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{t('date') || 'Date'}</label>
            <input
              type="date"
              className="w-full rounded-lg border px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{t('time') || 'Time'}</label>
            <div className="grid max-h-52 grid-cols-4 gap-2 overflow-auto rounded-lg border p-2">
              {workingSlots.map(h => {
                const disabled = busy.includes(h)
                const selected = slot === h
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => !disabled && setSlot(h)}
                    disabled={disabled}
                    className={`rounded-md px-2 py-1 text-xs
                      ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : selected ? 'bg-brand-600 text-white'
                                           : 'bg-white border hover:bg-brand-50'}`}
                  >
                    {h}
                  </button>
                )
              })}
            </div>
            {!!busy.length && (
              <p className="mt-1 text-[11px] text-slate-500">
                {t('some_slots_unavailable') || 'Some time slots are unavailable for the selected day.'}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={p.onClose} className="rounded-lg border px-4 py-2">
            {t('cancel') || f('Cancel', 'Cancelar', 'Cancelar')}
          </button>
          <button
            disabled={!canConfirm}
            onClick={confirm}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {t('confirm') || f('Confirm', 'Confirmar', 'Confirmar')}
          </button>
        </div>
      </div>
    </Modal>
  )
}
