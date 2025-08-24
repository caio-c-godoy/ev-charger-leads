import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const date = new URL(req.url).searchParams.get('date') || ''

  if (!date) {
    return Response.json({ busy: [] })
  }

  // Pega reservas do Supabase
  const { data, error } = await supabase
    .from('bookings')
    .select('time')
    .eq('date', date)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const busy = data?.map(x => x.time) || []
  return Response.json({ busy })
}
