'use client'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from './I18nProvider'

type Msg = { role:'user'|'assistant'; content:string }

export default function ChatWidget(){
  const { t, lang } = useI18n()
  const [open,setOpen] = useState(false)
  const [input,setInput] = useState('')
  const [loading,setLoading] = useState(false)
  const [msgs,setMsgs] = useState<Msg[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    setMsgs(m=>{
      if (m.length === 0) return [{ role:'assistant', content: t('chat_welcome') }]
      if (m[0]?.role === 'assistant') return [{ role:'assistant', content: t('chat_welcome') }, ...m.slice(1)]
      return m
    })
  }, [lang, t])

  useEffect(()=>{
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior:'smooth' })
  },[msgs,open])

  async function send(){
    const text = input.trim()
    if(!text || loading) return
    setMsgs(m=>[...m,{role:'user',content:text}])
    setInput('')
    setLoading(true)
    try{
      const res = await fetch('/api/ai-chat', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ messages:[...msgs,{role:'user',content:text}], lang })
      })
      const data = await res.json()
      setMsgs(m=>[...m,{role:'assistant',content: data.reply || t('chat_error') }])
    }catch{
      setMsgs(m=>[...m,{role:'assistant',content:t('chat_error')}])
    }finally{
      setLoading(false)
    }
  }

  const suggestions = [ t('chat_sug_license'), t('chat_sug_photos'), t('chat_sug_time') ]

  return (
    <>
      {/* FAB */}
      <button
        onClick={()=>setOpen(o=>!o)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-white shadow-brand hover:from-brand-600 hover:to-brand-800 transition"
        aria-label="Chat"
      >
        {open ? '×' : '💬'} {open ? '' : t('chat_button')}
      </button>

      {/* Caixa */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] rounded-2xl border border-brand-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-brand-500 to-brand-700 p-3 text-white">
            <div className="font-semibold">EV AI Assistant</div>
            <button onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">×</button>
          </div>

          <div ref={boxRef} className="max-h-[50vh] overflow-auto p-3 space-y-3">
            {msgs.map((m,i)=>(
              <div key={i} className={`rounded-xl px-3 py-2 text-sm ${m.role==='user'
                ? 'ml-auto max-w-[85%] bg-brand-50 text-brand-900 border border-brand-100'
                : 'mr-auto max-w-[92%] bg-white text-slate-800 border'}`
              }>
                {m.content}
              </div>
            ))}
            {!loading && msgs.length<=2 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s,i)=>(
                  <button key={i} onClick={()=>setInput(s)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs hover:bg-slate-100">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && <div className="text-xs text-slate-500">{t('chat_typing')}</div>}
          </div>

          <div className="flex items-center gap-2 border-t p-2">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=> e.key==='Enter' && send()}
              placeholder={t('chat_placeholder')}
              className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button onClick={send} disabled={loading}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-3 py-2 text-sm font-medium text-white hover:from-brand-600 hover:to-brand-800 transition disabled:opacity-50">
              {t('chat_send')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
