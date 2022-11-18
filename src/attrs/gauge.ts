import { zipObject } from 'lodash-es'

import { Dictionary } from '../util/common'
import { SetField, ValueDef } from '.'
import { Gauge, GaugeDefs, readableGauge } from '../defs/gauge'

// Gauge Support attribute
const GaugeSupport = new SetField<Gauge>('Supported Gauges', 'supportedGauges', {
  desc: 'The distance(s) between the two rails of a railway track supported by this vehicle',
  readableFn: readableGauge
})

// Dictionary of Gauge Support attributes keyed by distance (`mm`)
const GaugeAttrMap: Dictionary<ValueDef<Gauge>> =
  zipObject(GaugeDefs.map(g => g.mm), GaugeDefs.map(g => GaugeSupport.value(g)))

// Getters
export const GaugeByDist = (mm: number) => GaugeAttrMap[mm.toString()]
export const GaugesByDist = (...mm: number[]) => mm.map(mm => GaugeAttrMap[mm.toString()])