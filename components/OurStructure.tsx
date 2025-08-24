'use client'

import { useRef, useState } from 'react'
import Modal from './Modal'
import { useI18n } from './I18nProvider'

type Vid = { src: string; poster?: string }

const STRUCTURE_VIDEOS: Vid[] = [
  { src: '/structure4.mp4' },
  { src: '/structure1.mp4' },
  { src: '/structure2.mp4' },
  { src: '/structure3.mp4' },
]

export default function OurStructure() {
  const { t } = useI18n()
  const vidsRef = useRef<Array<HTMLVideoElement | null>>([])
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const play = (i: number) => {
    const v = vidsRef.current[i]
    if (v) v.play().catch(() => {})
  }

  const pause = (i: number) => {
    const v = vidsRef.current[i]
    if (v) {
      v.pause()
      try { v.currentTime = 0 } catch {}
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">
          {t('section_structure_title') || 'Nossa estrutura'}
        </h3>
        <p className="text-slate-600">
          {t('section_structure_sub') || 'Veja nossa estrutura, ferramentas e operação no dia a dia.'}
        </p>
      </div>

      {/* Grid: 1 linha (4 vídeos). No mobile, 2 colunas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STRUCTURE_VIDEOS.map((v, i) => (
          <button
            key={i}
            type="button"
            className="group relative overflow-hidden rounded-xl ring-1 ring-slate-200 hover:ring-brand-300 focus:outline-none"
            onClick={() => setOpenIdx(i)}
            onPointerEnter={() => play(i)}
            onPointerLeave={() => pause(i)}
            onPointerDown={() => play(i)} // ajuda no mobile
          >
            <video
              // >>> correção: callback ref deve retornar void
              ref={(el) => { vidsRef.current[i] = el }}
              src={v.src}
              poster={v.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {t('tap_to_expand') || 'Clique para ampliar'}
            </div>
          </button>
        ))}
      </div>

     {/* Modal com vídeo ampliado (mesmo padrão dos Installation videos) */}
    <Modal
      open={openIdx !== null}
      onClose={() => setOpenIdx(null)}
      title={t('structure_modal_title') || 'Estrutura – vídeo'}
      maxWidth="max-w-5xl"
    >
      {openIdx !== null && (
        <video
          key={STRUCTURE_VIDEOS[openIdx].src}
          src={STRUCTURE_VIDEOS[openIdx].src}
          autoPlay
          controls
          playsInline
          className="w-full h-auto max-h-[82svh] rounded-xl bg-black object-contain"
        />
      )}
    </Modal>

    </div>
  )
}
