import { Field, SetField } from '..'


// Tractive vehicle sub-types
const VehicleSubType = new Field('Vehicle Sub-Type', 'subtype')

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
const Traction = new SetField('Traction', 'traction')

export const ElectricTraction  = Traction.value('Electric')
export const DieselTraction    = Traction.value('Diesel')
export const SteamTraction     = Traction.value('Steam')