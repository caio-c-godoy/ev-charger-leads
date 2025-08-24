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
    const estimateRaw  = String(form.get('estimate') ?? '{}')
    const lang         = String(form.get('lang') ?? 'en')

    // Parse da estimativa
    let estimate: any = {}
    try { estimate = JSON.parse(estimateRaw) } catch {}

    const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    const pt = proType === 'licensed' ? 'Licensed' : 'Experienced'

    // Anexos (fotos)
    const attachments: any[] = []
    for (const key of ['panelFiles', 'siteFiles']){
      for (const f of form.getAll(key)){
        if (typeof f === 'string') continue
        const file = f as File
        const buf = Buffer.from(await file.arrayBuffer())
        attachments.push({ filename: file.name, content: buf })
      }
    }

    // SMTP
    const user = process.env.SMTP_USER || 'ev-victoriuscompany@gmail.com'
    const pass = process.env.SMTP_PASS || ''
    const to   = process.env.MAIL_TO   || 'ev-victoriuscompany@gmail.com'
    const from = process.env.MAIL_FROM || `EV Victorius <${user}>`
    const bcc  = process.env.MAIL_BCC  || 'caio@4uit.us' // cópia oculta p/ você

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user, pass },
    })

    const subject = `EV Lead: ${fullName || 'New'} • ${distanceFt || '?'}ft • ${pt}`

    // Texto simples (fallback)
    const text =
`New lead

Name: ${fullName}
Distance: ${distanceFt} ft
Pro: ${pt}
Charger: ${chargerModel}
Car: ${carModel}
Address: ${address}
Email: ${email}
Phone: ${phone}

Estimate:
- Wire: ${nf.format(estimate.wireCost || 0)}
- Breaker: ${nf.format(estimate.breakerCost || 0)}
- Tube (${estimate.tubeUnits ?? 0}): ${nf.format(estimate.tubeCost || 0)}
- Materials subtotal: ${nf.format(estimate.materialSubtotal || 0)}
- Labor: ${nf.format(estimate.labor || 0)}
= TOTAL: ${nf.format(estimate.total || 0)}

NOTICE: Automatic estimate. Amount may slightly change during execution due to extra materials, route adjustments or local code requirements. Any difference will be agreed before moving forward.`

    // HTML caprichado
    const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.4;color:#0f172a">
    <h2 style="margin:0 0 12px;font-size:20px;color:#0ea5e9">⚡ New EV Charger Lead</h2>
    <p style="margin:0 0 16px;color:#334155">Received: ${new Date().toLocaleString()}</p>

    <table cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <thead>
        <tr>
          <th colspan="2" style="text-align:left;padding:12px 16px;background:#f1f5f9;font-size:13px;color:#0f172a">Lead details</th>
        </tr>
      </thead>
      <tbody>
        ${row('Name', escape(fullName))}
        ${row('Distance', `${escape(distanceFt)} ft`)}
        ${row('Pro', escape(pt))}
        ${row('Charger', escape(chargerModel))}
        ${row('Car', escape(carModel))}
        ${row('Address', escape(address))}
        ${row('Email', escape(email))}
        ${row('Phone', escape(phone))}
      </tbody>
    </table>

    <div style="height:12px"></div>

    <table cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <thead>
        <tr>
          <th colspan="2" style="text-align:left;padding:12px 16px;background:#f1f5f9;font-size:13px;color:#0f172a">Estimate</th>
        </tr>
      </thead>
      <tbody>
        ${row('Wire', nf.format(estimate.wireCost || 0))}
        ${row('Breaker', nf.format(estimate.breakerCost || 0))}
        ${row(`Tube (${estimate.tubeUnits ?? 0})`, nf.format(estimate.tubeCost || 0))}
        ${row('<b>Materials subtotal</b>', `<b>${nf.format(estimate.materialSubtotal || 0)}</b>`)}
        ${row('Labor', nf.format(estimate.labor || 0))}
        ${row('<b>Total</b>', `<b>${nf.format(estimate.total || 0)}</b>`)}
      </tbody>
    </table>

    <p style="margin:16px 0 0;font-size:12px;color:#64748b;background:#fffbeb;border:1px solid #fef3c7;border-radius:8px;padding:10px">
      <b>Notice:</b> Automatic estimate. Final amount may slightly change during the installation due to extra materials,
      route adjustments or local code requirements. Any difference will be agreed before moving forward.
    </p>

    ${
      attachments.length
        ? `<p style="margin:8px 0 0;font-size:12px;color:#475569">Attached: ${attachments.length} file(s)</p>`
        : ''
    }
  </div>`

    function row(label: string, value: string){
      return `<tr>
        <td style="width:40%;padding:10px 16px;border-top:1px solid #e2e8f0;color:#475569">${label}</td>
        <td style="padding:10px 16px;border-top:1px solid #e2e8f0;color:#0f172a">${value || '-'}</td>
      </tr>`
    }
    function escape(s: string){ return String(s || '').replace(/[<&>"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c] as string)) }

    // Monta o envio: To (você), CC (cliente), BCC (você oculto), Reply-To (cliente)
    const mailOptions: any = {
      to,
      from,
      subject,
      text,
      html,
      attachments,
      replyTo: email || undefined,
      cc: email && email.toLowerCase() !== to.toLowerCase() ? email : undefined,
      bcc: bcc || undefined,
    }

    await transport.sendMail(mailOptions)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }catch(err:any){
    console.error('MAIL ERROR:', err)
    return new Response(JSON.stringify({ error: err?.message || 'send error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
