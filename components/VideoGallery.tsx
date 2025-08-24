'use client'

import { useState, useRef, useEffect } from 'react'
import Modal from './Modal'

type VideoItem = { src: string; poster?: string }

const VIDEOS: VideoItem[] = [
  { src: '/evcharger1.mp4' },
  { src: '/evcharger2.mp4' },
  { src: '/evcharge4.mp4' },
  { src: '/tesla3.mp4' },
]

export function VideoGallery() {
  const [viewer, setViewer] = useState<{ type: 'video'; src: string } | null>(null)
  const refs = useRef<(HTMLVideoElement | null)[]>([])

  // 🔹 Força autoplay em todos os vídeos logo no carregamento
  useEffect(() => {
    refs.current.forEach((v) => {
      if (v) {
        v.muted = true
        v.play().catch(() => {})
      }
    })
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {VIDEOS.map((v, i) => (
          <button
            key={i}
            type="button"
            className="group relative overflow-hidden rounded-2xl border bg-white p-0 shadow-soft transition hover:shadow-md focus:outline-none"
            onClick={() => setViewer({ type: 'video', src: v.src })}
            aria-label="Open video"
          >
            <div className="relative">
              <video
                ref={(el) => { refs.current[i] = el }}
                src={v.src}
                poster={v.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Modal SEM título */}
      <Modal open={!!viewer} onClose={() => setViewer(null)} maxWidth="max-w-5xl">
        {viewer && (
          <video
            src={viewer.src}
            autoPlay
            controls
            playsInline
            className="w-full h-auto max-h-[82svh] rounded-xl bg-black object-contain"
          />
        )}
      </Modal>
    </>
  )
}
