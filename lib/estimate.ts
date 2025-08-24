export type ProType = 'experienced' | 'licensed'

export type EstimateBreakdown = {
  distanceFt: number
  wireCost: number
  breakerCost: number
  tubeUnits: number
  tubeCost: number
  labor: number
  proType: ProType
  materialSubtotal: number
  total: number
}

/** Labor:
 * - experienced: $580 até 10 ft; +$10/ft acima de 10
 * - licensed:   $700 até 10 ft; +$20/ft acima de 10
 */
export function computeLabor(distanceFt: number, pro: ProType): number {
  const d = Math.max(0, Math.round(distanceFt))
  if (pro === 'experienced') return d <= 10 ? 580 : 580 + (d - 10) * 10
  return d <= 10 ? 1200 : 1200 + (d - 10) * 20
}

export function calcEstimate(distanceFt: number, pro: ProType): EstimateBreakdown {
  const d = Math.max(0, Math.round(distanceFt))
  const wireCost = d * 12
  const breakerCost = 45
  const tubeUnits = Math.ceil(d / 8)
  const tubeCost = tubeUnits * 7

  const materialSubtotal = wireCost + breakerCost + tubeCost
  const labor = computeLabor(d, pro)
  const total = materialSubtotal + labor

  return { distanceFt: d, wireCost, breakerCost, tubeUnits, tubeCost, labor, proType: pro, materialSubtotal, total }
}

export function money(n: number){
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
