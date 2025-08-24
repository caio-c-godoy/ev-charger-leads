// app/api/ai-chat/route.ts
export const runtime = 'nodejs'
import OpenAI from 'openai'

/** Resposta neutra para perguntas do tipo "precisa de licenciado/permissão?" */
function replyLicense(lang: string): string {
  if (lang?.startsWith('pt')) {
    return `Depende da sua cidade/condado. Para a maioria das instalações residenciais, enviamos **um profissional experiente** que segue o NEC e o código local — normalmente é suficiente.
Se a prefeitura exigir **permissão/licença**, também podemos agendar **eletricista licenciado** (o custo muda). Se puder, me diga seu **CEP** que verifico para você.`
  } else if (lang?.startsWith('es')) {
    return `Depende de tu ciudad/condado. Para la mayoría de instalaciones residenciales, enviamos **un profesional con experiencia** que cumple el NEC y la normativa local; suele ser suficiente.
Si tu municipio exige **permiso/licencia**, también podemos programar **un electricista con licencia** (el costo cambia). Si puedes, dime tu **código postal** y lo verifico.`
  }
  return `It depends on your city/county. For most residential installs we send an **experienced professional** who follows NEC and local code — that’s usually sufficient.
If your municipality requires a **permit/licensed contractor**, we can provide **a licensed electrician** (pricing differs). Share your **ZIP code** and I’ll check it for you.`
}

export async function POST(req: Request) {
  const { messages = [], lang = 'en' } = await req.json()

  // Guard: perguntas sobre licença/permissão respondem com texto neutro
  const last = (messages?.[messages.length - 1]?.content || '').toString()
  if (/(licen[cç]iad|licencia|license|licensed|permi[st][osãon]|alvará)/i.test(last)) {
    return Response.json({ reply: replyLicense(lang) }, { status: 200 })
  }

  // Prompt com foco em conversão e experiente como padrão
  const intro = {
    role: 'system' as const,
    content: `
You are the website assistant for Victorius EV Installation. Your goals:
- Be friendly, concise, and conversion-oriented.
- DEFAULT recommendation: "experienced professional" (unlicensed) who follows NEC and local code.
- Only mention a licensed electrician as an **optional upgrade** or **when the jurisdiction/permit requires it**. Do not claim it is mandatory everywhere.
- If asked whether a license is required, say "it depends on the city/county" and offer to check by ZIP. Avoid legal absolutes.
- Pricing rules (mention only if relevant or asked):
  • Wire $12/ft  • Breaker $45 fixed  • Tube $7 each 8ft (ceil by distance/8)
  • Labor experienced: $580 up to 10ft, +$10/ft above 10
  • Labor licensed:   $1200 up to 10ft, +$20/ft above 10
- Remind that final price may vary after on-site assessment (amperage, permits, drilling).
- Encourage a **front photo of the open electrical panel** (showing breakers) and a photo/video of the installation location.
- Use the user's language: ${lang}.
`.trim()
  }

  const key = (process.env.OPENAI_API_KEY || '').trim()
  if (!key) {
    const msg =
      lang.startsWith('pt') ? 'IA desativada: defina OPENAI_API_KEY no .env.local e reinicie.' :
      lang.startsWith('es') ? 'IA desactivada: define OPENAI_API_KEY en .env.local y reinicia.' :
      'AI disabled: set OPENAI_API_KEY in .env.local and restart.'
    return Response.json({ reply: msg }, { status: 200 })
  }

  try {
    const openai = new OpenAI({ apiKey: key })
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [intro, ...messages] as any,
    })
    const reply = resp.choices?.[0]?.message?.content || ''
    return Response.json({ reply: reply || (lang.startsWith('pt') ? 'Sem resposta no momento.' : 'No reply at the moment.') })
  } catch (e: any) {
    const status = e?.status || e?.response?.status
    if (status === 429) {
      const quota =
        lang.startsWith('pt') ? 'IA temporariamente indisponível (quota). Tente mais tarde.' :
        lang.startsWith('es') ? 'IA temporalmente indisponible (cuota). Inténtalo más tarde.' :
        'AI temporarily unavailable (quota). Please try later.'
      return Response.json({ reply: quota }, { status: 200 })
    }
    console.error('AI ERROR:', e?.message || e)
    const generic =
      lang.startsWith('pt') ? 'Erro de IA. Tente novamente.' :
      lang.startsWith('es') ? 'Error de IA. Inténtalo de nuevo.' :
      'AI error. Please try again.'
    return Response.json({ reply: generic }, { status: 200 })
  }
}
