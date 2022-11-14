import { Field, SetField } from '..'


// Tractive vehicle sub-types
const VehicleSubType = new Field<string>('Vehicle Sub-Type', 'subtype')

export const MiscellaneousVehicle          = VehicleSubType.value('Miscellaneous Vehicle')
export const ElectricLocomotive            = VehicleSubType.value('Electric Locomotive')
export const DieselLocomotive              = VehicleSubType.value('Diesel Locomotive')
export const HighSpeedElectricMultiUnitSet = VehicleSubType.value('Electric Multiple-Unit Set (high speed)').notes('Power Car or Trailer')
export const LowSpeedElectricMultiUnitSet  = VehicleSubType.value('Electric Multiple-Unit Set (except high speed)').notes('Power Car or Trailer')
export const DieselMultiUnitSet            = VehicleSubType.value('Diesel multiple-unit Set').notes('Power Car or Trailer')
export const SpecialisedTrailer            = VehicleSubType.value('Specialised Trailer')
export const ElectricShunter               = VehicleSubType.value('Electric Shunting Engine')
export const DieselShunter                 = VehicleSubType.value('Diesel Shunting Engine')
export const SpecialVehicle                = VehicleSubType.value('Special Vehicle')

//TODO these may be redundant
// Types of traction (electric, diesel, etc)
type TractionType = 'Electric' | 'Diesel' | 'Steam'
export const Traction = new SetField<TractionType>('Traction', 'traction')