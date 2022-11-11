import { applyDigitRules, Rule } from '.'
import * as C from '../attrs/vehicles/common'
import * as P from '../attrs/vehicles/hauled-passenger'


// ---- General rules (digit 5 only) -----------------------------

const HauledPassengerRulesD5: Rule[] = [
  // Coach Type
  { pattern: /[45]/, defs: [ P.CoachType.value('Couchette Car') ] },
  { pattern: /7/,    defs: [ P.CoachType.value('Sleeper Car') ] },
  { pattern: /[89]/, defs: [ P.CoachType.value('Special Car or Van') ] },

  // Coach Class
  { pattern: /1/,    defs: [ P.CoachClass.value('1st') ] },
  { pattern: /2/,    defs: [ P.CoachClass.value('2nd') ] },
  { pattern: /[34]/, defs: [ P.CoachClass.value('1st or 1st/2nd') ] },
  { pattern: /5/,    defs: [ P.CoachClass.value('2nd') ] },
]

// ---- Hauled-passenger (both digits 5 and 6) ----------------------

const CompartmentNote = 'Fractions of a compartment are not considered. The equivalent accommodation in open saloon cars with centre aisle is obtained by dividing the number of available seats by 6, 8, or 10 depending on the construction of the vehicle.'
const DescTmpl = (n: string) => `Coach with ${n} side-corridor compartments or equivalent open-saloon space with center aisle`

const HauledPassengerRulesD56: Rule[] = [
  // Coach Descriptions
  ...[
    { pattern: /[123]0/, defs: [ P.CoachDesc.value(DescTmpl('10')) ] },
    { pattern: /11/,     defs: [ P.CoachDesc.value(DescTmpl('11 or more')) ] },
    { pattern: /[23]1/,  defs: [ P.CoachDesc.value(DescTmpl('11')) ] },
    { pattern: /[23]2/,  defs: [ P.CoachDesc.value(DescTmpl('12 or more')) ] },
    { pattern: /30/,     defs: [ P.CoachDesc.value(DescTmpl('10')) ] },
    { pattern: /[457]0/, defs: [ P.CoachDesc.value('Coach with 10 compartments') ] },
    { pattern: /[57]1/,  defs: [ P.CoachDesc.value('Coach with 11 compartments') ] },
    { pattern: /52/,     defs: [ P.CoachDesc.value('Coach with 12 or more compartments') ] },
    { pattern: /72/,     defs: [ P.CoachDesc.value('Coach with 12 compartments') ] },
    { pattern: /44/,     defs: [ P.CoachDesc.value('Coach with 9 or fewer compartments') ] },
    { pattern: /17/,     defs: [ P.CoachDesc.value(DescTmpl('7 or more')) ] },
    { pattern: /18/,     defs: [ P.CoachDesc.value(DescTmpl('8')) ] },
    { pattern: /[23]8/,  defs: [ P.CoachDesc.value(DescTmpl('8 or more')) ] },
    { pattern: /[123]9/, defs: [ P.CoachDesc.value(DescTmpl('9')) ] },
    { pattern: /[45]9/,  defs: [ P.CoachDesc.value('Coach with 9 or fewer compartments') ] },
    { pattern: /75/,     defs: [ P.CoachDesc.value('Coach with over 12 compartments') ] },
    { pattern: /80/,     defs: [ P.CoachDesc.value('Driving trailer with seats, all classes, with or without luggage compartment, with driving cab for reversible working') ] },
    { pattern: /81/,     defs: [ P.CoachDesc.value('Vehicle with 1st or 1st/2nd class seats with luggage or mail compartment') ] },
    { pattern: /82/,     defs: [ P.CoachDesc.value('Vehicle with 2nd class seats with luggage or mail compartment') ] },
    { pattern: /84/,     defs: [ P.CoachDesc.value('Vehicle with seats, all classes with specially-fitted areas, e.g. children’s play area') ] },
    { pattern: /90/,     defs: [ P.CoachDesc.value('Mail van') ] },
    { pattern: /91/,     defs: [ P.CoachDesc.value('Luggage van with mail compartment') ] },
    { pattern: /92/,     defs: [ P.CoachDesc.value('Luggage van') ] },
    { pattern: /93/,     defs: [ P.CoachDesc.value('Luggage van and two or three-axle 2nd class vehicles with seats, with luggage or mail compartment') ] },
    { pattern: /94/,     defs: [ P.CoachDesc.value('Side-corridor luggage van, with or without compartment under customs seal') ] },
    { pattern: /[123]6/, defs: [ P.CoachDesc.value('Double-deck coach') ] },
    { pattern: /[123]6/, defs: [ P.CoachDesc.value('Double-deck coach') ] },
    { pattern: /25/,     defs: [ P.CoachDesc.value('Only for OSJD, double-deck coach') ] },
    { pattern: /85/,     defs: [ P.CoachDesc.value('Coach with seats and couchette cars, all classes, with bar or buffet area') ] },
    { pattern: /86/,     defs: [ P.CoachDesc.value('Double-deck driving coach with seats, all classes, with or without luggage compartment, with driving cab for reversible working') ] },
    { pattern: /87/,     defs: [ P.CoachDesc.value('Dining car or coach with bar or buffet area, with luggage compartment') ] },
    { pattern: /88/,     defs: [ P.CoachDesc.value('Dining car') ] },
    { pattern: /89/,     defs: [ P.CoachDesc.value('Other special coach (conference, disco, bar, cinema, video, ambulance coaches)') ] },
    { pattern: /95/,     defs: [ P.CoachDesc.value('Two or three axle luggage van with mail compartment') ] },
    { pattern: /97/,     defs: [ P.CoachDesc.value('Two or three axle car-carrying wagon') ] },
    { pattern: /98/,     defs: [ P.CoachDesc.value('Car carrying wagon') ] },
    { pattern: /99/,     defs: [ P.CoachDesc.value('Service vehicle') ] }
  ].map(r => ({ pattern: r.pattern, defs: r.defs.map(d => d.notes(CompartmentNote)) })),

  // Dining Amenities
  { pattern: /8[578]/, defs: [ P.DiningAmenities.value('yes') ] },
  
  // Special Amenities
  { pattern: /8[49]/, defs: [ P.SpecialAmenities.value('yes') ] },

  // Double Decker
  { pattern: /[1238]6/, defs: [ P.DoubleDecker ] },
  { pattern: /25/,      defs: [ P.DoubleDecker ] },

  // Axles
  { pattern: /[13]4/,  defs: [ C.AxleCount.value({ min: 2, max: 3 }) ] },
  { pattern: /23/,     defs: [ C.AxleCount.value({ exactly: 3 }) ] },
  { pattern: /24/,     defs: [ C.AxleCount.value({ exactly: 2 }) ] },
  { pattern: /9[357]/, defs: [ C.AxleCount.value({ min: 2, max: 3 }) ] },

  // Class
  { pattern: /81/,       defs: [ P.CoachClass.value('1st or 1st/2nd') ] },
  { pattern: /82/,       defs: [ P.CoachClass.value('2nd') ] },
  { pattern: /8[0456]/,  defs: [ P.CoachClass.value('1st/2nd') ] },

  // Mail
  { pattern: /9[015]/, defs: [ P.Mail.value('yes') ] },
  { pattern: /93/,     defs: [ P.Mail.value('maybe') ] },

  // Luggage
  { pattern: /8[012]/, defs: [ P.Luggage.value('maybe') ] },
  { pattern: /86/,     defs: [ P.Luggage.value('maybe') ] },
  { pattern: /87/,     defs: [ P.Luggage.value('yes') ] },
  { pattern: /93/,     defs: [ P.Luggage.value('maybe') ] },
  { pattern: /9[124]/, defs: [ P.Luggage.value('yes') ] },
  { pattern: /95/,     defs: [ P.Luggage.value('yes') ] },

  // Driving Trailer
  { pattern: /8[06]/,  defs: [ P.DrivingTrailer ] },

  // Car-carrying wagon
  { pattern: /9[78]/,   defs: [ P.CarCarryingWagon ] }
]


// ---- General rules (digit 7 only) -----------------------------

// Allowed Speed defs

const HauledPassengerRulesD7: Rule[] = [
  // Max Speed
  { pattern: /[012]/,  defs: [ C.AllowedSpeeds.value({ max: 120, unit: 'km/h' }) ] },
  { pattern: /[3456]/, defs: [ C.AllowedSpeeds.value({ min: 121, max: 140, unit: 'km/h' }) ] },
  { pattern: /[78]/,   defs: [ C.AllowedSpeeds.value({ min: 141, max: 160, unit: 'km/h' }) ] },
  { pattern: /9/,      defs: [ C.AllowedSpeeds.value({ min: 160, unit: 'km/h' }) ] }
]


// ---- Hauled-passenger (both digits 7 and 8) ----------------------

const { One, Two, Star } = P.EnergySupplyNotes // Energy Supply Notes

const HauledPassengerRulesD78: Rule[] = [
  // Energy Supply - All Tensions
  { pattern: /30/,          defs: [ P.AllTensions ] },
  { pattern: /[45789]1/,    defs: [ P.AllTensions ] },
  { pattern: /[459]2/,      defs: [ P.AllTensions ] },

  // Energy Supply - All Tensions (*)
  { pattern: /[014578]0/,   defs: [ P.AllTensions.notes(Star) ] },
  { pattern: /8[048]/,      defs: [ P.AllTensions.notes(Star) ] },
  
  // Energy Supply - All Tensions (2)
  { pattern: /72/,          defs: [ P.AllTensions.notes(Two) ] },

  // Energy Supply - All Tensions (*)(2)
  { pattern: /90/,          defs: [ P.AllTensions.notes(Star, Two) ] },
  
  // Energy Supply - Steam (1)
  { pattern: /1[^6]/,       defs: [ P.SteamPower.notes(One) ] },
  { pattern: /2[^9]/,       defs: [ P.SteamPower.notes(One) ] },
  { pattern: /4[^469]/,     defs: [ P.SteamPower.notes(One) ] },
  { pattern: /5[^4689]/,    defs: [ P.SteamPower.notes(One) ] },
  { pattern: /6[06]/,       defs: [ P.SteamPower.notes(One) ] },
  { pattern: /8[01458]/,    defs: [ P.SteamPower.notes(One) ] },
  { pattern: /92/,          defs: [ P.SteamPower.notes(One) ] },

  // Energy Supply - 1000V AC
  { pattern: /1[1-5]/,      defs: [ P.AC1000 ] },
  { pattern: /3[256]/,      defs: [ P.AC1000 ] },
  { pattern: /45/,          defs: [ P.AC1000 ] },
  { pattern: /53/,          defs: [ P.AC1000 ] },
  { pattern: /[78]5/,       defs: [ P.AC1000 ] },
  { pattern: /9[345]/,      defs: [ P.AC1000 ] },

  // Energy Supply - 1000V AC (*)
  { pattern: /[07]3/,       defs: [ P.AC1000.notes(Star) ] },

  // Energy Supply - 1000V AC (1)(*)
  { pattern: /3[34]/,       defs: [ P.AC1000.notes(One, Star) ] },
  { pattern: /43/,          defs: [ P.AC1000.notes(One, Star) ] },

  // Energy Supply - 1500V AC
  { pattern: /[47]4/,       defs: [ P.AC1500 ] },
  { pattern: /[05]5/,       defs: [ P.AC1500 ] },
  { pattern: /[237]6/,      defs: [ P.AC1500 ] },
  { pattern: /[01234579]7/, defs: [ P.AC1500 ] },
  { pattern: /28/,          defs: [ P.AC1500 ] },
  { pattern: /93/,          defs: [ P.AC1500 ] },

  // Energy Supply - 1500V AC (1)
  { pattern: /72/,          defs: [ P.AC1500.notes(One) ] },

  // Energy Supply - 3000V AC
  { pattern: /2[0268]/,     defs: [ P.AC3000 ] },
  { pattern: /4[26]/,       defs: [ P.AC3000 ] },
  { pattern: /6[248]/,      defs: [ P.AC3000 ] },

  // Energy Supply - 1500V DC
  { pattern: /[47]4/,       defs: [ P.DC1500 ] },
  { pattern: /36/,          defs: [ P.DC1500 ] },
  { pattern: /[0134579]7/,  defs: [ P.DC1500 ] },

  // Energy Supply - 3000V DC
  { pattern: /[02368]2/,    defs: [ P.DC3000 ] },
  { pattern: /[26]4/,       defs: [ P.DC3000 ] },
  { pattern: /[248]6/,      defs: [ P.DC3000 ] },
  { pattern: /[013479]8/,   defs: [ P.DC3000 ] },
  { pattern: /[137]9/,      defs: [ P.DC3000 ] },

  // Energy Supply - 3000V DC (1)
  { pattern: /72/,          defs: [ P.DC3000.notes(One) ] },

  // Energy Supply - Tensions other than 1000 V, 1500 V, 3000 V
  { pattern: /[05]6/,       defs: [ P.NonStandardTensions ] },
  { pattern: /87/,          defs: [ P.NonStandardTensions ] },

  // Energy Supply - Autonomous Power
  { pattern: /[2689]9/,     defs: [ P.AutonomousPower.notes(One) ] },

  // Energy Supply - Generator Power
  { pattern: /[89]9/,       defs: [ P.GeneratorPower.notes(Two) ] }
]

// Returns vehicle attributes for the given Ohm parse node of digits 5 and 6 of special tractive units
export const applyHauledPassengerD56 = applyDigitRules(HauledPassengerRulesD5, HauledPassengerRulesD56)

// Returns vehicle attributes for the given Ohm parse node of digits 7 and 8 of special tractive units
export const applyHauledPassengerD78 = applyDigitRules(HauledPassengerRulesD7, HauledPassengerRulesD78)
