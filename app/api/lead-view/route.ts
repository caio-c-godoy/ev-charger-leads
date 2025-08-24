import nodemailer from 'nodemailer'

export async function POST(req: Request){
  try{
    const form = await req.formData()
    const fullName     = String(form.get('fullName') ?? '')
    const distanceFt   = String(form.get('distanceFt') ?? '')
    const proType      = String(form.get('proType') ?? '')
    const chargerModel = String(form.get('chargerModel') ?? '')
    const carModel     = String(form.get('carModel') ?? '')
    const address      = String(form.get('address') ?? '')
    const email        = String(form.get('email') ?? '')
    const phone        = String(form.get('phone') ?? '')
    const estimate     = String(form.get('estimate') ?? '{}')
    const lang         = String(form.get('lang') ?? 'en')

    const user = process.env.SMTP_USER || 'ev-victoriuscompany@gmail.com'
    const pass = process.env.SMTP_PASS || ''
    const to   = process.env.MAIL_TO   || 'ev-victoriuscompany@gmail.com'
    const from = process.env.MAIL_FROM || `EV Victorius <${user}>`
    const bcc  = process.env.MAIL_BCC  || 'caio@4uit.us'

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user, pass },
    })

    const disclaimer =
      lang.startsWith('pt') ? 'AVISO: Estimativa automática. O valor poderá sofrer pequenas alterações durante a execução por necessidade de materiais adicionais, ajustes de percurso ou adequações ao código local. Qualquer diferença será combinada antes de prosseguir.' :
      lang.startsWith('es') ? 'AVISO: Estimación automática. El monto puede cambiar ligeramente durante la ejecución por materiales adicionales, ajustes de recorrido o requisitos del código local. Cualquier diferencia se acordará antes de continuar.' :
                              'NOTICE: Automatic estimate. Amount may slightly change due to extra materials, route adjustments or local code requirements. Any difference will be agreed before proceeding.'

    const subject = `Viewed estimate - ${distanceFt} ft - ${proType || 'experienced'}`
    const text =
`A visitor viewed the estimate

Name: ${fullName}
Phone: ${phone}
Email: ${email}
Address: ${address}

Distance: ${distanceFt} ft
Pro: ${proType}
Charger: ${chargerModel}
Car: ${carModel}

Estimate JSON:
${estimate}

${disclaimer}
`
    await transport.sendMail({ to, from, subject, text, bcc: bcc || undefined })

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
  }catch(err:any){
    console.error('LEAD-VIEW ERROR:', err?.message || err)
    return new Response(JSON.stringify({ error: err?.message || 'send error' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
