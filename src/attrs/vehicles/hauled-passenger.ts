import { Field, SetField } from '..'
import { YesNo, YesNoMaybe } from '../common-values'


// Hauled-passenger Vehicle Type
type CoachType = 'Passenger Car' | 'Couchette Car' | 'Sleeper Car' | 'Special Car or Van'
export const CoachType = new Field<CoachType>('Coach Type', 'coach.type')

// Coach Description
export const CoachDesc = new Field<string>('Coach Description', 'coach.description')

// Coach Class
type Class = '1st' | '2nd' | '1st/2nd' | '1st or 1st/2nd'
export const CoachClass = new Field<Class>('Passenger Class', 'coach.class')

// Double-deck
const DoubleDeckerField = new Field<YesNo>('Double Deck Coach', 'coach.doubleDecker')
export const DoubleDecker = DoubleDeckerField.value('Yes')

// Mail Van or with mail compartment
export const Mail = new Field<YesNoMaybe>('Mail', 'coach.mail', { desc: 'Vehicle for the dedicated purpose of mail carriage or with special mail compartment' })

// Luggage Van
export const Luggage = new Field<YesNoMaybe>('Luggage', 'coach.luggage', { desc: 'Vehicle for the dedicated purpose of luggage carriage or with special luggage compartment'})

// Car-carrying Wagon
export const CarCarryingWagon = new Field<YesNo>('Car-carrying Wagon', 'coach.carCarrier').value('Yes')

// Dining Car
export const DiningAmenities = new Field<YesNoMaybe>('Dining Car', 'coach.dining', { desc: 'Dining car or coach with bar or buffet' })

// Special Amenities
export const SpecialAmenities = new Field<YesNoMaybe>('Special Amenities', 'coach.specialAmenities', { desc: 'Car with other special amenities (conference, disco, cinema, video, child area, ambulance coaches)' })

// Driving Trailer
export const DrivingTrailer = new Field<YesNoMaybe>('Driving Cab', 'coach.drivingCab', { desc: 'An unpowered coach fitted with a driving cab for reversible working' }).value('Yes')

// Energy Supply
const Energy = new SetField<string>('Energy Supply', 'coach.energy')

export const AC1000              = Energy.value('1000 V AC')
export const AC1500              = Energy.value('1500 V AC')
export const AC3000              = Energy.value('3000 V AC')
export const DC1500              = Energy.value('1500 V DC')
export const DC3000              = Energy.value('3000 V DC')
export const AllTensions         = Energy.value('All Tensions', 'Single phase alternating current 1000 V 51 to 15 Hz, single phase alternating current 1500 V 50 Hz, direct current 1500 V, direct current 3000 V. Can include single phase alternating current 3000 V 50 Hz.')
export const NonStandardTensions = Energy.value('Non-Standard Tensions', 'Tensions other than 1000 V, 1500 V, 3000 V')
export const SteamPower          = Energy.value('Steam Heating', 'Steam used for heating only. If tensions are written, the code is also available for vehicles without steam heating.')
export const AutonomousPower     = Energy.value('Autonomous Power', 'Autonomous heating, without train bus electricity supply line.')
export const GeneratorPower      = Energy.value('Generator Power', 'Vehicles with train bus electricity supply line for all voltages, but requiring a generator van to supply air-conditioning.')

export const EnergySupplyNotes = {
  One: 'Only for domestic traffic vehicles.',
  Two: 'Only for international traffic vehicles.',
  Star: 'For certain vehicles with 1000 V single phase alternating current, only one frequency, either 16 2/3 or 50 Hz, is permitted.'
}