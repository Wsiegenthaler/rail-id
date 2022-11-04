import { Field } from '../builders'


export const VehicleType = new Field('Vehicle Type', 'vehicleType')
export const VehicleSubType = new Field('Vehicle Sub-Type', 'vehicleSubtype')

export const WagonVehicle    = VehicleType.value('Wagon')
export const HauledPassenger = VehicleType.value('Hauled-passenger Car')
export const TractiveVehicle = VehicleType.value('Tractive Vehicle')
export const SpecialVehicle  = VehicleType.value('Special Vehicle')
