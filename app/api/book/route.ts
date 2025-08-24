import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import nodemailer from 'nodemailer'

function icsContent(summary: string, description: string, startISO: string) {
  const dtStart = startISO.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const dtEnd = new Date(new Date(startISO).getTime() + 60*60*1000)
    .toISOString()
    .replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, time } = body as { date: string; time: string }

    if (!date || !time) {
      return Response.json({ error: 'Missing date/time' }, { status: 400 })
    }

    // Valida conflito no Supabase
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)

    if (existing && existing.length > 0) {
      return Response.json({ error: 'Time already booked' }, { status: 409 })
    }

    // Insere no Supabase
const { error: insertErr } = await supabase.from('bookings').insert([
  {
    date,
    time,
    full_name: body.fullName || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    charger_model: body.chargerModel || '',
    car_model: body.carModel || '',
    pro_type: body.proType,
    distance_ft: body.distanceFt,
    estimate: body.estimate || {},
  },
])


    if (insertErr) {
      return Response.json({ error: insertErr.message }, { status: 400 })
    }

    // --- Telegram e e-mail permanecem iguais ---
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

    const tgToken = process.env.TELEGRAM_BOT_TOKEN || ''
    const tgChat = process.env.TELEGRAM_CHAT_ID || ''
    if (tgToken && tgChat) {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: lines }),
      })
    }

    const user = process.env.SMTP_USER || ''
    const pass = process.env.SMTP_PASS || ''
    const to = process.env.MAIL_TO || user
    const from =
      process.env.MAIL_FROM ||
      (user ? `EV Victorius <${user}>` : 'EV Victorius <no-reply@local>')

    if (user && pass) {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 465),
        secure: true,
        auth: { user, pass },
      })
      const startIso = new Date(`${date}T${time}:00Z`).toISOString()
      const ics = icsContent('EV Charger Installation', lines, startIso)
      await transport.sendMail({
        to,
        from,
        subject: `Booking - ${date} ${time} - ${body.fullName || ''}`,
        text: lines,
        attachments: [
          { filename: 'booking.ics', content: ics, contentType: 'text/calendar' },
        ],
      })
    }

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err?.message || 'book error' }, { status: 500 })
  }
}
