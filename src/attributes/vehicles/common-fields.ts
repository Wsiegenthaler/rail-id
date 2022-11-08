import { SetField } from '../builders'


//TODO these may be redundant
// Types of traction (electric, diesel, etc)
const Traction = new SetField('Traction', 'traction')

export const ElectricTraction  = Traction.value('Electric')
export const DieselTraction    = Traction.value('Diesel')
export const SteamTraction     = Traction.value('Steam')


// General info which doesn't fit into other fields
export const VehicleNotes = new SetField('Vehicle Notes', 'vehicleNotes')

export const MaintenanceWagonNote     = VehicleNotes.value('Maintenance related wagon')
export const MiscWagonNote            = VehicleNotes.value('Miscellaneous wagon')
export const MiscPassengerVehicleNote = VehicleNotes.value('Miscellaneous passenger vehicle')
export const TEN_COTIF_WagonNote      = VehicleNotes.value('TEN and/or COTIF wagon')
export const PPV_PPW_WagonNote        = VehicleNotes.value('PPV/PPW wagon')
export const SpecialNumberedWagonNote = VehicleNotes.value('Wagon with special numbering for technical characteristics not placed in service inside EU')
