import { zipObject } from 'lodash-es'

import { Dictionary } from '../util/common'
import { SetField, ValueDef } from '.'
import { GaugeDefs } from '../defs/gauge'

// Gauge Support attribute
const GaugeSupport = new SetField('Supported Track Gauges', 'supportedTrackGauges', 'Track gauges supported by this vehicle')

// Dictionary of Gauge Support attributes keyed by distance (`mm`)
const GaugeAttrMap: Dictionary<ValueDef<any>> = zipObject(GaugeDefs.map(g => g.mm), GaugeDefs.map(g => GaugeSupport.value(g)))

// Getters
export const GaugeByDist = (mm: number) => GaugeAttrMap[mm.toString()]
export const GaugesByDist = (...mm: number[]) => mm.map(mm => GaugeAttrMap[mm.toString()])