
export type YesNo = 'Yes' | 'No'

export type YesNoMaybe = 'Yes' | 'No' | 'Maybe'

export type SpeedUnit = 'km/h' | 'm/h'

export type SpeedRange = { min: number, max?: number, unit: SpeedUnit } | { min?: number, max: number, unit: SpeedUnit }
