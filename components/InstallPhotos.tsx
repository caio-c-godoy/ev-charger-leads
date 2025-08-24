'use client'

import { useState } from 'react'
import Modal from './Modal'

const IMAGES = [
   '/bmw1.jpeg',
  '/evcharger1.jpeg',
  '/teslacar.jpeg',
  '/evchargetesla.jpeg',
]

export default function InstallPhotos() {
  const [viewer, setViewer] = useState<{ type: 'image'; src: string } | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {IMAGES.map((src, i) => (
          <button
            key={i}
            className="group overflow-hidden rounded-2xl border bg-white p-0 shadow-soft transition hover:shadow-md focus:outline-none"
            onClick={() => setViewer({ type: 'image', src })}
            aria-label="Open photo"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Modal open={!!viewer} onClose={() => setViewer(null)} maxWidth="max-w-5xl">
        {viewer && (
          <img
            src={viewer.src}
            alt=""
            className="w-full h-auto max-h-[82svh] rounded-xl object-contain"
          />
        )}
      </Modal>
    </>
  )
}
