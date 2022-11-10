
export type YesNo = 'yes' | 'no'

export type YesNoMaybe = 'yes' | 'no' | 'maybe'

export type SpeedUnit = 'km/h' | 'm/h'

export type SpeedRange = { min: number, max?: number, unit: SpeedUnit } | { min?: number, max: number, unit: SpeedUnit }
