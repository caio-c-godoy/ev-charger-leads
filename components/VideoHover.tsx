'use client'
import { useEffect, useRef } from 'react'

export default function VideoHover({ src, poster, className }: { src: string; poster?: string; className?: string }){
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    const onEnter = () => v.play().catch(()=>{})
    const onLeave = () => { v.pause(); try { v.currentTime = 0 } catch {} }

    v.addEventListener('pointerenter', onEnter)
    v.addEventListener('pointerleave', onLeave)
    v.addEventListener('touchstart', onEnter, { passive: true })

    const obs = new IntersectionObserver(([entry]) => {
      if (!v) return
      const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      if (isTouch){
        if (entry.isIntersecting) v.play().catch(()=>{})
        else v.pause()
      }
    }, { threshold: 0.6 })
    obs.observe(v)

    return () => {
      v.removeEventListener('pointerenter', onEnter)
      v.removeEventListener('pointerleave', onLeave)
      v.removeEventListener('touchstart', onEnter)
      obs.disconnect()
    }
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
