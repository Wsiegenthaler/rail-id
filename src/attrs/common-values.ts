
export type YesNo = 'Yes' | 'No'


export type YesNoMaybe = 'Yes' | 'No' | 'Maybe'


export type SpeedUnit = 'km/h' | 'm/h'


export type SpeedRange =
  { min: number, max?: number, unit: SpeedUnit } |
  { min?: number, max: number, unit: SpeedUnit }

export const readableSpeedRange = (s: SpeedRange) => {
  if (s.min && s.max) return `${s.min} to ${s.max} ${s.unit}`
  if (!s.min) return `Up to ${s.max} ${s.unit}`
  if (!s.max) return `${s.min} ${s.unit} and over`
}


export type AxleCount =
  { type: 'exact', value: number } |
  { type: 'min', max: number } |
  { type: 'max', min: number } |
  { type: 'between', min: number, max: number }

export const readableAxleCount = (ac: AxleCount) => {
  if (ac.type === 'exact')       return `${ac.value} axles`
  if (ac.type === 'between')  return `Between ${ac.min} and ${ac.max} axles`
  if (ac.type === 'max') return `At least ${ac.min} axles`
  return `Up to ${ac.max} axles`
}