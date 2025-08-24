'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: string // ex.: "max-w-4xl"
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-4xl',
}: Props) {
  // fecha no ESC + trava o scroll do body
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* backdrop */}
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* conteúdo */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-[10000] w-[92vw] ${maxWidth} rounded-2xl bg-white p-4 shadow-2xl outline-none`}
      >
        {title ? (
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-2 text-slate-200 hover:bg-black/20"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        <div className="relative">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
