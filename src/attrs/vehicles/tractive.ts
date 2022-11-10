import { Field, SetField } from '..'


// Tractive vehicle sub-types
const VehicleSubType = new Field<string>('Vehicle Sub-Type', 'subtype')

export const MiscellaneousVehicle          = VehicleSubType.value('Miscellaneous vehicle')
export const ElectricLocomotive            = VehicleSubType.value('Electric locomotive')
export const DieselLocomotive              = VehicleSubType.value('Diesel locomotive')
export const HighSpeedElectricMultiUnitSet = VehicleSubType.value('Electric multiple-unit set (high speed) [power car or trailer]')
export const LowSpeedElectricMultiUnitSet  = VehicleSubType.value('Electric multiple-unit set (except high speed) [power car or trailer]')
export const DieselMultiUnitSet            = VehicleSubType.value('Diesel multiple-unit set [power car or trailer]')
export const SpecialisedTrailer            = VehicleSubType.value('Specialised trailer')
export const ElectricShunter               = VehicleSubType.value('Electric shunting engine')
export const DieselShunter                 = VehicleSubType.value('Diesel shunting engine')
export const SpecialVehicle                = VehicleSubType.value('Special vehicle')

//TODO these may be redundant
// Types of traction (electric, diesel, etc)
type TractionType = 'electric' | 'diesel' | 'steam'
export const Traction = new SetField<TractionType>('Traction', 'traction')