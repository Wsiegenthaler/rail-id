import { Field } from '..'
import { SpeedRange } from '../common-values'


// Energy supplies for hauled-passenger cars
const Energy = new Field<string>('Energy Supply', 'passenger.energy')

export const EnergySupplyNotes = {
  One: 'Only for domestic traffic vehicles.',
  Two: 'Only for international traffic vehicles.',
  Star: 'For certain vehicles with 1000 V single phase alternating current, only one frequency, either 16 2/3 or 50 Hz, is permitted.'
}

export const AC1000              = Energy.value('1000 V AC')
export const AC1500              = Energy.value('1500 V AC')
export const AC3000              = Energy.value('3000 V AC')
export const DC1500              = Energy.value('1500 V DC')
export const DC3000              = Energy.value('3000 V DC')
export const AllTensions         = Energy.value('All Tensions', 'Single phase alternating current 1000 V 51 to 15 Hz, single phase alternating current 1500 V 50 Hz, direct current 1500 V, direct current 3000 V. Can include single phase alternating current 3000 V 50 Hz.')
export const NonStandardTensions = Energy.value('Non-Standard Tensions', 'Tensions other than 1000 V, 1500 V, 3000 V')
export const SteamPower          = Energy.value('Steam Heating', 'Steam heating only. If tensions are written, the code is also available for vehicles without steam heating.')
export const AutonomousPower     = Energy.value('Autonomous Power', 'Autonomous heating, without train bus electricity supply line.')
export const GeneratorPower      = Energy.value('Generator Power', 'Vehicles with train bus electricity supply line for all voltages, but requiring a generator van to supply air-conditioning.')