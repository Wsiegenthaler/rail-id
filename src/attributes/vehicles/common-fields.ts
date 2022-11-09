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
export const Keeper = new Field<string>('Vehicle Keeper Marking', 'keeper')

// UIC Checksum status
const ChecksumStatus = new Field<string>('UIC Checksum Status', `${META_PATH}.checksum`)

export const ChecksumPassed = ChecksumStatus.value('passed')
export const ChecksumFailed = ChecksumStatus.value('failed')
export const ChecksumAbsent = ChecksumStatus.value('absent')

// General info which doesn't fit into other fields
export const VehicleNotes = new SetField('Vehicle Notes', 'notes')

export const MaintenanceWagonNote     = VehicleNotes.value('Maintenance related wagon')
export const MiscWagonNote            = VehicleNotes.value('Miscellaneous wagon')
export const MiscPassengerVehicleNote = VehicleNotes.value('Miscellaneous passenger vehicle')
export const TEN_COTIF_WagonNote      = VehicleNotes.value('TEN and/or COTIF wagon')
export const PPV_PPW_WagonNote        = VehicleNotes.value('PPV/PPW wagon')
export const SpecialNumberedWagonNote = VehicleNotes.value('Wagon with special numbering for technical characteristics not placed in service inside EU')
