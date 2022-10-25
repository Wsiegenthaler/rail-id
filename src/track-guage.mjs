import { zipObject } from "lodash-es"

// Factories
const Gauge = (name, type, mm) => ({ name, type, mm })
const NarrowGauge = (name, mm) => Gauge(name, 'narrow', mm)
const BroadGauge = (name, mm) => Gauge(name, 'broad', mm)

// Defs
export const RailGauges = [
  Gauge('Fifteen Inch', 'minimum', 381),
  
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

  Gauge('Standard', 'standard', 1435),

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

// Rail gauges by distance (mm)
const RailGaugeMap = zipObject(RailGauges.map(g => g.mm.toString()))
export const GaugeByDist = mm => RailGaugeMap[mm.toString()]

// Standard gauge
export const StandardGauge = RailGaugeMap['1435']