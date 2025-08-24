import { NextRequest } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

const DATA = path.join(process.cwd(), 'data', 'bookings.json')

async function readStore(){
  try{
    const raw = await fs.readFile(DATA, 'utf8')
    return JSON.parse(raw) as Record<string, Array<{time:string}>>
  }catch{
    return {}
  }
}

export async function GET(req: NextRequest){
  const date = new URL(req.url).searchParams.get('date') || ''
  const store = await readStore()
  const day = Array.isArray(store[date]) ? store[date] : []
  const busy = day.map(x => x.time)
  return Response.json({ busy })
}
