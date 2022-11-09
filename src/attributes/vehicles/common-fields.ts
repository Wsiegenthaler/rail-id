import { KeeperDef } from '../../uic/keepers'
import { Field, META_PATH, SetField } from '../builders'


//TODO these may be redundant
// Types of traction (electric, diesel, etc)
const Traction = new SetField('Traction', 'traction')

export const ElectricTraction  = Traction.value('Electric')
export const DieselTraction    = Traction.value('Diesel')
export const SteamTraction     = Traction.value('Steam')

// Vehicle serial number
export const SerialNumber = new Field<string>('Serial Number', 'serial')

// Vehicle Owner (UIC VKM)
export const Keeper = new Field<KeeperDef>('Vehicle Keeper', 'keeper')

// Raw Code
export const RawCode = new Field('Raw Code', `${META_PATH}.raw`)

// UIC Checksum status
const ChecksumStatus = new Field<string>('UIC Checksum Status', `${META_PATH}.checksum`)

export const ChecksumPassed = ChecksumStatus.value('passed')
export const ChecksumFailed = ChecksumStatus.value('failed')
export const ChecksumAbsent = ChecksumStatus.value('absent')

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

// Warnings (a place to report oddities encountered during parsing)
export const ParseWarnings = new SetField('Parse Warnings', `${META_PATH}.warnings`)