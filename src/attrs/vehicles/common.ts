import { Field, SetField } from '..'
import { KeeperDef } from '../../defs/keepers'


// Vehicle serial number
export const SerialNumber = new Field<string>('Serial Number', 'serial')

// Vehicle Owner (UIC VKM)
export const Keeper = new Field<KeeperDef>('Vehicle Keeper', 'keeper')

// Max Speed field
export const MaxSpeed = new Field('Maximum Speed', 'vmax')

// Self-propulsion
const SelfPropulsion = new Field<boolean>('Self Propelled', 'selfPropelled')

export const SelfPropelled = SelfPropulsion.value(true)
export const NonSelfPropelled = SelfPropulsion.value(false)

// Notes - general info which doesn't fit into other fields
export const VehicleNotes = new SetField('Vehicle Notes', 'notes')

export const MaintenanceWagonNote     = VehicleNotes.value('Maintenance related wagon')
export const MiscWagonNote            = VehicleNotes.value('Miscellaneous wagon')
export const MiscPassengerVehicleNote = VehicleNotes.value('Miscellaneous passenger vehicle')
export const TEN_COTIF_WagonNote      = VehicleNotes.value('TEN and/or COTIF wagon')
export const PPV_PPW_WagonNote        = VehicleNotes.value('PPV/PPW wagon')
export const SpecialNumberedWagonNote = VehicleNotes.value('Wagon with special numbering for technical characteristics not placed in service inside EU')

// TEN Vehicle Designation
const VehicleDesignation_TEN = new Field<boolean>('TEN Vehicle', `designations.ten`)
export const TENVehicle = VehicleDesignation_TEN.value(true)

// RIV Vehicle Designation
const VehicleDesignation_RIV = new Field<boolean>('RIV Vehicle', `designations.riv`)
export const RIVVehicle = VehicleDesignation_RIV.value(true)
