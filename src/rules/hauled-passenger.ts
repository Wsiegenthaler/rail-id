import { applyDigitRules, Rule } from '.'
import * as P from '../attrs/vehicles/hauled-passenger'


// ---- General rules (digit 5 only) -----------------------------

const UICHauledPassengerRulesD5: Rule[] = [
  // TODO
  { pattern: /[012]/,  defs: [ P.KphUnder120 ] },
]


// ---- Hauled-passenger (both digits 5 and 6) ----------------------

const UICHauledPassengerRulesD56: Rule[] = [
  // TODO
  { pattern: /30/,          defs: [ P.AllTensions ] },
]

// ---- Energy Supply Notes --------------------------------------

const { One, Two, Star } = P.EnergySupplyNotes


// ---- General rules (digit 7 only) -----------------------------

const UICHauledPassengerRulesD7: Rule[] = [
  // Max Speed
  { pattern: /[012]/,  defs: [ P.KphUnder120 ] },
  { pattern: /[3456]/, defs: [ P.KphFrom121To140 ] },
  { pattern: /[78]/,   defs: [ P.KphFrom141To160 ] },
  { pattern: /9/,      defs: [ P.KphOver160 ] }
]


// ---- Hauled-passenger (both digits 7 and 8) ----------------------

const UICHauledPassengerRulesD78: Rule[] = [
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
export const uicHauledPassengerD56 = applyDigitRules(UICHauledPassengerRulesD5, UICHauledPassengerRulesD56)

// Returns vehicle attributes for the given Ohm parse node of digits 7 and 8 of special tractive units
export const uicHauledPassengerD78 = applyDigitRules(UICHauledPassengerRulesD7, UICHauledPassengerRulesD78)
