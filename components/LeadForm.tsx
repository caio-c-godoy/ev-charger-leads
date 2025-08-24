'use client'

import { useMemo, useRef, useState } from 'react'
import Modal from './Modal'
import { calcEstimate, money, type ProType } from '@/lib/estimate'
import { useI18n } from './I18nProvider'
import ScheduleModal from './ScheduleModal'

function PreviewThumb({ file }: { file: File }) {
  const [url, setUrl] = useState<string>('')
  if (!url && typeof window !== 'undefined') {
    setUrl(URL.createObjectURL(file))
  }
  return <img src={url} alt="preview" className="h-16 w-full rounded-lg object-cover ring-1 ring-brand-200" />
}

export default function LeadForm() {
  const { t, lang } = useI18n()

  // Campos
  const [fullName, setFullName] = useState('')
  const [distanceFt, setDistanceFt] = useState<number>(0)
  const [chargerModel, setChargerModel] = useState('')
  const [carModel, setCarModel] = useState('')
  const [address, setAddress] = useState('')
  const [proType, setProType] = useState<ProType>('experienced')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Uploads
  const [panelFiles, setPanelFiles] = useState<File[]>([])
  const [siteFiles, setSiteFiles] = useState<File[]>([])
  const panelPhotoRef = useRef<HTMLInputElement>(null)
  const panelPickerRef = useRef<HTMLInputElement>(null)
  const sitePhotoRef = useRef<HTMLInputElement>(null)
  const siteVideoRef = useRef<HTMLInputElement>(null)
  const sitePickerRef = useRef<HTMLInputElement>(null)

  // UI
  const [showEstimate, setShowEstimate] = useState(false)
  const [openSchedule, setOpenSchedule] = useState(false)
  const [sending, setSending] = useState<'email' | null>(null)
  const [toast, setToast] = useState<string>('')

  // Estimate
  const breakdown = useMemo(() => calcEstimate(distanceFt || 0, proType), [distanceFt, proType])

  // Fallback pontuais (se a chave não existir em i18n.ts)
  const F = (key: string, pt: string, es: string, en: string) => {
    const v = t(key)
    if (v === key) {
      if (lang === 'pt') return pt
      if (lang === 'es') return es
      return en
    }
    return v
  }

  const resetToastLater = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const addFiles = (setter: (f: File[]) => void, current: File[], list: FileList | null) => {
    if (!list) return
    setter([...current, ...Array.from(list)])
  }

  // RESET TOTAL do formulário (usado só no “Refazer estimativa” e ao enviar email com sucesso)
  const resetAll = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setDistanceFt(0)
    setChargerModel('')
    setCarModel('')
    setProType('experienced')
    setPanelFiles([])
    setSiteFiles([])
    setShowEstimate(false)
    setOpenSchedule(false)
    setSending(null)
    setToast('')
    panelPhotoRef.current && (panelPhotoRef.current.value = '')
    panelPickerRef.current && (panelPickerRef.current.value = '')
    sitePhotoRef.current && (sitePhotoRef.current.value = '')
    siteVideoRef.current && (siteVideoRef.current.value = '')
    sitePickerRef.current && (sitePickerRef.current.value = '')
  }

  async function sendEmail() {
    try {
      setSending('email')
      const fd = new FormData()
      fd.set('fullName', fullName)
      fd.set('distanceFt', String(distanceFt || 0))
      fd.set('chargerModel', chargerModel)
      fd.set('carModel', carModel)
      fd.set('address', address)
      fd.set('proType', proType)
      fd.set('email', email)
      fd.set('phone', phone)
      fd.set('channel', 'email')
      fd.set('estimate', JSON.stringify(breakdown))
      fd.set('lang', lang)
      for (const f of panelFiles) fd.append('panelFiles', f)
      for (const f of siteFiles) fd.append('siteFiles', f)

      const res = await fetch('/api/lead', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Send error')
      resetToastLater(F('toast_email_sent', 'E-mail enviado!', '¡Correo enviado!', 'Email sent!'))
      resetAll() // limpa só no sucesso do envio de e-mail
    } catch (err: any) {
      resetToastLater(err?.message || 'Send error')
    } finally {
      setSending(null)
    }
  }

  async function handleViewEstimate() {
    setShowEstimate(true)
    try {
      const fd = new FormData()
      fd.set('fullName', fullName)
      fd.set('distanceFt', String(distanceFt || 0))
      fd.set('proType', proType)
      fd.set('chargerModel', chargerModel)
      fd.set('carModel', carModel)
      fd.set('address', address)
      fd.set('email', email)
      fd.set('phone', phone)
      fd.set('estimate', JSON.stringify(breakdown))
      fd.set('lang', lang)
      fetch('/api/lead-view', { method: 'POST', body: fd })
    } catch {}
  }

  // “Voltar” ou fechar o modal de estimativa → só fecha, não limpa
  const closeEstimate = () => {
    setShowEstimate(false)
  }

  return (
    <div className="rounded-2xl border border-brand-100 bg-white/90 p-6 shadow-lg shadow-brand-100/60 backdrop-blur">
      <div className="grid gap-6 md:grid-cols-2">
        {/* COLUNA ESQUERDA */}
        <div className="grid gap-6">
          {/* Distância */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('distance_label')}</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={distanceFt || ''}
              onChange={(e) => setDistanceFt(Number((e.target.value || '').replace(/\D/g, '')))}
              placeholder="Ex.: 25"
              required
            />
          </div>

          {/* Modelos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t('charger_model_label')}</label>
              <input
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                value={chargerModel}
                onChange={(e) => setChargerModel(e.target.value)}
                placeholder="Ex.: Tesla Wall Connector"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t('car_model_label')}</label>
              <input
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                placeholder="Ex.: Model Y 2023"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('address_label')}</label>
            <input
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex.: 123 Main St, Orlando, FL"
            />
          </div>

          {/* Preferência de profissional */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">{t('license_pref_label')}</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { k: 'experienced', label: t('experienced_option') },
                { k: 'licensed', label: t('licensed_option') },
              ].map((op) => (
                <label
                  key={op.k}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 transition
                    ${proType === (op.k as any)
                      ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-blue-50 text-brand-700 ring-1 ring-brand-200'
                      : 'hover:bg-slate-50'}`}
                >
                  <input
                    type="radio"
                    name="proType"
                    value={op.k}
                    checked={proType === (op.k as any)}
                    onChange={() => setProType(op.k as ProType)}
                    className="mr-2 accent-brand-600"
                  />
                  {op.label}
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">{t('license_pref_help')}</p>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="grid gap-6">
          {/* Painel */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('panel_upload_label')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => panelPhotoRef.current?.click()}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
              >
                📷 {t('btn_take_photo')}
              </button>
              <button
                type="button"
                onClick={() => panelPickerRef.current?.click()}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
              >
                🖼️ {t('btn_pick_gallery')}
              </button>
            </div>
            {/* @ts-ignore */}
            <input
              ref={panelPhotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => addFiles(setPanelFiles, panelFiles, e.target.files)}
            />
            <input
              ref={panelPickerRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setPanelFiles(Array.from(e.target.files || []))}
            />
            <div className="mt-2 grid grid-cols-4 gap-2">
              {panelFiles.filter(f => f.type.startsWith('image/')).map((f, i) => <PreviewThumb key={i} file={f} />)}
            </div>
            <div className="mt-1 text-xs text-slate-500">{t('panel_upload_hint')}</div>
          </div>

          {/* Local da instalação */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('site_upload_label')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => sitePhotoRef.current?.click()}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
              >
                📷 {t('btn_take_photo')}
              </button>
              <button
                type="button"
                onClick={() => siteVideoRef.current?.click()}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
              >
                🎥 {t('btn_record_video')}
              </button>
              <button
                type="button"
                onClick={() => sitePickerRef.current?.click()}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm text-brand-800 shadow-sm hover:bg-brand-50"
              >
                🖼️ {t('btn_pick_gallery')}
              </button>
            </div>
            {/* @ts-ignore */}
            <input
              ref={sitePhotoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => addFiles(setSiteFiles, siteFiles, e.target.files)}
            />
            {/* @ts-ignore */}
            <input
              ref={siteVideoRef}
              type="file"
              accept="video/*"
              capture="environment"
              className="hidden"
              onChange={(e) => addFiles(setSiteFiles, siteFiles, e.target.files)}
            />
            <input
              ref={sitePickerRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => setSiteFiles(Array.from(e.target.files || []))}
            />
            <div className="mt-2 grid grid-cols-4 gap-2">
              {siteFiles.filter(f => f.type.startsWith('image/')).map((f, i) => <PreviewThumb key={`si-${i}`} file={f} />)}
              {siteFiles.filter(f => f.type.startsWith('video/')).map((f, i) => (
                <div key={`sv-${i}`} className="rounded-lg border p-2 text-xs text-slate-600">🎥 {f.name || 'video'}</div>
              ))}
            </div>
          </div>

          {/* Contato (NOME acima de e-mail/telefone) */}
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t('name_label') || F('name_label', 'Nome completo', 'Nombre completo', 'Full name')}
              </label>
              <input
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={F('name_placeholder', 'Ex.: João Silva', 'Ej.: Juan Pérez', 'Ex.: John Doe')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('email_label')}</label>
                <input
                  type="email"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('phone_label')}</label>
                <input
                  type="tel"
                  className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(407) 555-0123"
                />
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleViewEstimate}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 font-medium text-white shadow-brand transition hover:from-brand-600 hover:to-brand-800"
            >
              {t('btn_view_estimate')}
            </button>
            <button
              disabled={sending === 'email'}
              onClick={sendEmail}
              className="rounded-xl border border-brand-300 bg-white px-5 py-3 font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
            >
              {sending === 'email' ? '...' : t('btn_send_email')}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {t('disclaimer') ||
              F(
                'disclaimer',
                'Estimativa automática. O valor final pode variar após a avaliação no local.',
                'Estimación automática. El valor final puede variar tras la visita.',
                'Automatic estimate. Final price may vary after on-site assessment.'
              )}
          </p>

          {toast && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{toast}</div>}
        </div>
      </div>

      {/* Modal da estimativa */}
      <Modal open={showEstimate} onClose={closeEstimate} title={t('estimate_title')}>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between"><span>{t('distance')}</span><span className="font-medium">{breakdown.distanceFt}</span></div>
          <div className="flex items-center justify-between"><span>{t('wire_label')}</span><span className="font-medium">{money(breakdown.wireCost)}</span></div>
          <div className="flex items-center justify-between"><span>{t('breaker_label')}</span><span className="font-medium">{money(breakdown.breakerCost)}</span></div>
          <div className="flex items-center justify-between"><span>{t('tube_label', { units: breakdown.tubeUnits })}</span><span className="font-medium">{money(breakdown.tubeCost)}</span></div>
          <div className="flex items-center justify-between border-t pt-2"><span>{t('materials_subtotal')}</span><span className="font-semibold">{money(breakdown.materialSubtotal)}</span></div>
          <div className="flex items-center justify-between"><span>{t('labor_label')}</span><span className="font-medium">{money(breakdown.labor)}</span></div>
          <div className="flex items-center justify-between border-t pt-2 text-base"><span>{t('total_estimate')}</span><span className="font-bold">{money(breakdown.total)}</span></div>

          {/* --- BOTÕES: Voltar, Refazer, Agendar --- */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {/* Voltar: fecha o modal e mantém os dados */}
              <button
                type="button"
                onClick={() => setShowEstimate(false)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                {t('btn_back') || 'Voltar'}
              </button>

              {/* Refazer estimativa: limpa tudo e fecha o modal */}
              <button
                type="button"
                onClick={resetAll}
                className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-rose-700 hover:bg-rose-50"
              >
                {t('btn_redo_estimate') || 'Refazer estimativa'}
              </button>
            </div>

            {/* Agendar instalação */}
            <button
              type="button"
              onClick={() => setOpenSchedule(true)}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2 text-white"
            >
              {t('schedule_title') || 'Agendar instalação'}
            </button>
          </div>

          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <p className="text-xs leading-relaxed">
              {t('disclaimer') ||
                'Estimativa automática. O valor final pode variar após a avaliação no local.'}
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal de agendamento */}
      <ScheduleModal
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        fullName={fullName}
        email={email}
        phone={phone}
        address={address}
        proType={proType}
        distanceFt={breakdown.distanceFt}
        estimateJson={breakdown}
        chargerModel={chargerModel}
        carModel={carModel}
      />
    </div>
  )
}
