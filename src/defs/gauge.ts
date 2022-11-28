import { zipObject } from 'lodash-es'

import { Dictionary } from '../util/common'


type GaugeType = 'Standard' | 'Broad' | 'Narrow' | 'Minimum'

export interface Gauge { name: string, mm: number, type: GaugeType }

export const displayGauge = (g: Gauge) => `${g.name} / ${g.type} / ${g.mm} mm`

// Factories
const Gauge = (name: string, type: GaugeType, mm: number): Readonly<Gauge> => ({ name, mm, type })
const NarrowGauge = (name: string, mm: number): Readonly<Gauge> => ({ name, mm, type: 'Narrow' })
const BroadGauge = (name: string, mm: number): Readonly<Gauge> => ({ name, mm, type: 'Broad' })

// Definitions
export const GaugeDefs = [
  Gauge('Fifteen Inch', 'Minimum', 381),
  
  NarrowGauge('600 mm', 600),
  NarrowGauge('Two Foot', 610),
  NarrowGauge('750 mm', 750),
  NarrowGauge('Bosnian Gauge', 760),
  NarrowGauge('Two Foot Six Inch', 762),
  NarrowGauge('Swedish Three Foot', 891),
  NarrowGauge('900 mm', 900),
  NarrowGauge('Three Foot', 914),
  NarrowGauge('Italian Metre', 950),
  NarrowGauge('Metre', 1000),
  NarrowGauge('Three Foot Six Inch', 1067),
  NarrowGauge('Four foot', 1219),
  NarrowGauge('Four Foot Six Inch', 1372),
  NarrowGauge('1432 mm', 1432),

  Gauge('Standard', 'Standard', 1435),

  BroadGauge('Italian Broad Gauge', 1445),
  BroadGauge('Dresden Gauge', 1450),
  BroadGauge('Leipzig Gauge', 1458),
  BroadGauge('Toronto Gauge', 1495),
  BroadGauge('1520 mm', 1520),
  BroadGauge('Five Foot', 1524),
  BroadGauge('Pennsylvania Gauge (5 ft 2.25 in)', 1581),
  BroadGauge('Pennsylvania Gauge (5 ft 2.5 in)', 1588),
  BroadGauge('Five Foot Three Inch', 1676),
  BroadGauge('Baltimore Gauge', 1638),
  BroadGauge('Iberian Gauge', 1668),
  BroadGauge('Five Foot Six Inch', 1676),
  BroadGauge('Six Foot', 1829),
  BroadGauge('Brunel', 2140)
]

// Dictionary of Gauges by distance (`mm`)
const GaugeMap: Dictionary<Gauge> = zipObject(GaugeDefs.map(g => g.mm.toString()), GaugeDefs)
export const GaugeByDist = (...mm: number[]) => {
  if (mm.length > 1) return mm.map(mm => GaugeMap[mm.toString()])
  return GaugeMap[mm.toString()]
}

// Standard gauge (exported for convenience)
export const StandardGauge = GaugeByDist(1435)