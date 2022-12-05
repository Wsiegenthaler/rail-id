import { applyRules, Rule } from '..'
import * as C from '../../attrs/vehicles/common'
import * as P from '../../attrs/vehicles/hauled-passenger'


// ---- Hauled-Passenger - Serial Letters ------------------------

const HauledPassengerRules_Serial: Rule[] = [
  { pattern: /AB/,       defs: [ P.CoachClass.value('1st/2nd') ] },
  { pattern: /A/,        defs: [ P.CoachClass.value('1st') ] },
  { pattern: /B/,        defs: [ P.CoachClass.value('2nd') ] },
  { pattern: /WL/,       defs: [ P.CoachType.value('Sleeper Car') ] },
  { pattern: /WLS/,      defs: [ P.CoachType.value('Sleeper Car').notes('This sleeper car has special accomodations') ] },
  { pattern: /WR/,       defs: [ P.DiningAmenities.value('Yes') ] },
  { pattern: /R/,        defs: [ P.DiningAmenities.value('Yes') ] },
  { pattern: /DD/,       defs: [
    P.CarCarryingWagon,
    P.CarCarryingType.value('Open'),
    P.CarCarryingType.value('2-tier'),
    P.DoubleDecker
  ] },
  { pattern: /D/,        defs: [ P.CoachType.value('Van') ] },
  { pattern: /Post/,     defs: [ P.Mail.value('Yes') ] },
  { pattern: /AS|SR|WG/, defs: [ P.SpecialAmenities.value('Yes') ] },
  { pattern: /WSP/,      defs: [ P.CoachType.value('Pullman Coach') ] },
  { pattern: /Laeq/,     defs: [
    C.AxleCountField.value({ type: 'exact', value: 3 }),
    P.CarCarryingWagon,
    P.CarCarryingType.value('Open'),
    P.CarCarryingType.value('2-tier'),
    P.CarCarryingType.value('Fitted with train supply cable'),
    P.DoubleDecker
  ] },
  { pattern: /Leq/,      defs: [
    C.AxleCountField.value({ type: 'exact', value: 2 }),
    P.CarCarryingWagon,
    P.CarCarryingType.value('Open'),
    P.CarCarryingType.value('2-tier'),
    P.CarCarryingType.value('Fitted with train supply cable'),
    P.DoubleDecker

  ] },
  { pattern: /Le/,       defs: [
    C.AxleCountField.value({ type: 'exact', value: 2 }),
    P.CarCarryingWagon,
    P.CarCarryingType.value('Open'),
    P.CarCarryingType.value('2-tier'),
    P.DoubleDecker
  ] }
]

// ---- Hauled-Passenger - Index Letters -------------------------

const HauledPassengerRules_Index: Rule[] = [
  { pattern: /b|h/,  defs: [  ] },
  { pattern: /c/,    defs: [  ] },
  { pattern: /d|v/,  defs: [  ] },
  { pattern: /ee|z/, defs: [  ] },
  { pattern: /f/,    defs: [  ] },
  { pattern: /p|t/,  defs: [  ] },
  { pattern: /m/,    defs: [ P.CoachLength.value({ length: { type: 'exact', value: 24.5 }, unit: 'meters', type: 'static' }) ] },
  { pattern: /s/,    defs: [  ] },
]


// Returns vehicle attributes for the given Ohm parse node of digits 5 and 6 of special tractive units
export const applyHauledPassenger_Serial = applyRules(HauledPassengerRules_Serial)

// Returns vehicle attributes for the given Ohm parse node of digits 7 and 8 of special tractive units
export const applyHauledPassenger_Index = applyRules(HauledPassengerRules_Index)
