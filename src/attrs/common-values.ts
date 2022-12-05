
export type YesNo = 'Yes' | 'No'


export type YesNoMaybe = 'Yes' | 'No' | 'Maybe'


export type SpeedUnit = 'km/h' | 'm/h'


export type SpeedRange =
  { min: number, max?: number, unit: SpeedUnit } |
  { min?: number, max: number, unit: SpeedUnit }

export const displaySpeedRange = (s: SpeedRange) => {
  if (s.min && s.max) return `${s.min} to ${s.max} ${s.unit}`
  if (!s.min) return `Up to ${s.max} ${s.unit}`
  if (!s.max) return `${s.min} ${s.unit} and over`
}


export type ValueRange =
  { type: 'exact', value: number } |
  { type: 'min', max: number } |
  { type: 'max', min: number } |
  { type: 'between', min: number, max: number }

export type AxleCount = ValueRange

export const displayAxleCount = (ac: AxleCount) => {
  if (ac.type === 'exact')   return `${ac.value} axles`
  if (ac.type === 'between') return `Between ${ac.min} and ${ac.max} axles`
  if (ac.type === 'max')     return `At least ${ac.min} axles`
  return `Up to ${ac.max} axles`
}

export type LoadLimitVal = { axles: AxleCount, loadLimit: ValueRange, unit: 'tons' }

export type VehicleLength =
  { type: 'static', length: ValueRange, unit: 'meters' } |
  { type: 'with-axles', withAxles: AxleCount, length: ValueRange, unit: 'meters' }

export const displayVehicleLength = (l: VehicleLength) => {
  const displayLength = (r: ValueRange) => {
    if (r.type === 'exact')   return r.value
    if (r.type === 'between') return `Between ${r.min} and ${r.max}`
    if (r.type === 'max')     return `At least ${r.min}`
    return `Up to ${r.max}`
  }

  if (l.type === 'static') {
    return `${displayLength(l.length)} ${l.unit}`
  } else if (l.type === 'with-axles') {
    return `${displayAxleCount(l.withAxles)}: ${displayLength(l.length)} ${l.unit}`
  }
}