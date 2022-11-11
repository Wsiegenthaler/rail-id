import { Field, SetField } from '..'
import { KeeperDef } from '../../defs/keepers'
import { SpeedRange, YesNo } from '../common-values'


// Vehicle serial number
export const SerialNumber = new Field<string>('Serial Number', 'serial')

// Max Speed field
export const AllowedSpeeds = new SetField<SpeedRange>('Allowed Speed', 'speeds')

// Axle Count
type AxleCount = { exactly: number } | { min: number }
export const AxleCount = new Field<AxleCount>('Axle Count', 'axles')

// Self-propulsion
export const SelfPropelled = new Field<YesNo>('Self Propelled', 'selfPropelled')

// Vehicle Designation
const VehicleDesignation_TEN = new Field<YesNo>('TEN Vehicle', `designations.ten`)
export const TENVehicle = VehicleDesignation_TEN.value('yes')

// RIV Vehicle Designation
const VehicleDesignation_RIV = new Field<YesNo>('RIV Vehicle', `designations.riv`)
export const RIVVehicle = VehicleDesignation_RIV.value('yes')

// Notes - general info which doesn't fit into other fields
export const VehicleNotes = new SetField<string>('Vehicle Notes', 'notes')

export const MaintenanceWagonNote     = VehicleNotes.value('Maintenance related wagon')
export const MiscWagonNote            = VehicleNotes.value('Miscellaneous wagon')
export const MiscPassengerVehicleNote = VehicleNotes.value('Miscellaneous passenger vehicle')
export const TEN_COTIF_WagonNote      = VehicleNotes.value('TEN and/or COTIF wagon')
export const PPV_PPW_WagonNote        = VehicleNotes.value('PPV/PPW wagon')
export const SpecialNumberedWagonNote = VehicleNotes.value('Wagon with special numbering for technical characteristics not placed in service inside EU')

