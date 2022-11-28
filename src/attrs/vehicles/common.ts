import { Field, SetField } from '..'
import { AxleCount, SpeedRange, YesNo } from '../common-values'
import { displayAxleCount, displaySpeedRange } from '../common-values'


// Vehicle serial number
export const SerialNumber = new Field<string>('Vehicle Serial', 'serial')

// Permitted Speeds field
export const PermittedSpeeds = new SetField<SpeedRange>('Permitted Speed', 'speeds', { displayFn: displaySpeedRange })

// Axle Count
export const AxleCountField = new Field<AxleCount>('Axle Count', 'axles', { displayFn: displayAxleCount })

// Self-propulsion
export const SelfPropelled = new Field<YesNo>('Self Propelled', 'selfPropelled')

// Vehicle Designation
const VehicleDesignation_TEN = new Field<YesNo>('TEN Interoperable', `designations.TEN`, { desc: 'This marking describes vehicles interoperable with the "Trans-European Transport Network" (TEN-T)' })
export const TENVehicle = VehicleDesignation_TEN.value('Yes')

// RIV Vehicle Designation
//TODO better metadata
const VehicleDesignation_RIV = new Field<YesNo>('RIV Vehicle', `designations.RIV`)
export const RIVVehicle = VehicleDesignation_RIV.value('Yes')

// Other Notes - General info which doesn't fit into other fields
export const OtherNotes = new SetField<string>('Other Notes', 'notes')