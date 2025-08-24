import { NextRequest } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import nodemailer from 'nodemailer'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA = path.join(DATA_DIR, 'bookings.json')

async function readStore(){
  try{
    const raw = await fs.readFile(DATA, 'utf8')
    return JSON.parse(raw) as Record<string, any[]>
  }catch{
    return {}
  }
}
async function writeStore(obj: Record<string, any[]>){
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA, JSON.stringify(obj, null, 2))
}

function icsContent(summary: string, description: string, startISO: string){
  // evento de 60 minutos
  const dtStart = startISO.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')
  const dtEnd   = new Date(new Date(startISO).getTime() + 60*60*1000).toISOString()
                      .replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Victorius EV//Schedule//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@victorius-ev`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g,'\\n')}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

export async function POST(req: NextRequest){
  try{
    const body = await req.json()
    const { date, time } = body as { date:string; time:string }

    if (!date || !time) return Response.json({ error: 'Missing date/time' }, { status: 400 })

    // valida conflito
    const store = await readStore()
    const day = store[date] || []
    if (day.some(x => x.time === time)){
      return Response.json({ error: 'Time already booked' }, { status: 409 })
    }

    // salva
    const booking = {
      time,
      createdAt: new Date().toISOString(),
      ...body
    }
    store[date] = [...day, booking]
    await writeStore(store)

    // monta resumo para alerta
    const lines = [
      `🗓️ *New EV install booking*`,
      `Date: ${date} ${time}`,
      `Name: ${body.fullName || ''}`,
      `Phone: ${body.phone || ''}`,
      `Email: ${body.email || ''}`,
      `Address: ${body.address || ''}`,
      `Charger: ${body.chargerModel || ''}`,
      `Car: ${body.carModel || ''}`,
      `Pro type: ${body.proType}`,
      `Distance: ${body.distanceFt} ft`,
      `Materials: $${body.estimate?.materialSubtotal ?? ''}`,
      `Labor: $${body.estimate?.labor ?? ''}`,
      `Total: $${body.estimate?.total ?? ''}`,
    ].join('\n')

    // Telegram (opcional)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN || ''
    const tgChat  = process.env.TELEGRAM_CHAT_ID || ''
    if (tgToken && tgChat){
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: lines })
      })
    }

    // Email opcional com .ics
    const user = process.env.SMTP_USER || ''
    const pass = process.env.SMTP_PASS || ''
    const to   = process.env.MAIL_TO   || user
    const from = process.env.MAIL_FROM || (user ? `EV Victorius <${user}>` : 'EV Victorius <no-reply@local>')
    if (user && pass){
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: { user, pass },
      })
      const startIso = new Date(`${date}T${time}:00Z`).toISOString()
      const ics = icsContent('EV Charger Installation', lines, startIso)
      await transport.sendMail({
        to, from,
        subject: `Booking - ${date} ${time} - ${body.fullName || ''}`,
        text: lines,
        attachments: [{ filename: 'booking.ics', content: ics, contentType: 'text/calendar' }]
      })
    }

    return Response.json({ ok: true })
  }catch(err:any){
    return Response.json({ error: err?.message || 'book error' }, { status: 500 })
  }
}
