import { applyRules, Rule } from '..'
import * as C from '../../attrs/vehicles/common'
import * as P from '../../attrs/vehicles/hauled-passenger'


// ---- Hauled-Passenger - Serial Letters ------------------------

const HauledPassengerRules_Serial: Rule[] = [
  { pattern: /AB/,       defs: [  ] },
  { pattern: /A/,        defs: [  ] },
  { pattern: /B/,        defs: [  ] },
  { pattern: /WL/,       defs: [  ] },
  { pattern: /WR/,       defs: [  ] },
  { pattern: /R/,        defs: [  ] },
  { pattern: /DD/,       defs: [  ] },
  { pattern: /D/,        defs: [  ] },
  { pattern: /Post/,     defs: [ P.Mail.value('Yes') ] },
  { pattern: /AS|SR|WG/, defs: [  ] },
  { pattern: /WSP/,      defs: [  ] },
  { pattern: /Laeq/,     defs: [  ] },
  { pattern: /Leq/,      defs: [  ] },
  { pattern: /Le/,       defs: [  ] }

//  = "AB"                  -- AB
//  | "A"                   -- A
//  | "B"                   -- B
//  | "WL"                  -- WL
//  | "WR"                  -- WR
//  | "R"                   -- R
//  | "DD"                  -- DD
//  | "D"                   -- D
//  | "Post"                -- Post
//  | ("AS" | "SR" | "WG")  -- AS_SR_WG
//  | "WSP"                 -- WSP
//  | "Laeq"                -- Laeq
//  | "Leq"                 -- Leq
//  | "Le"                  -- Le
]

// ---- Hauled-Passenger - Index Letters -------------------------

const HauledPassengerRules_Index: Rule[] = [
  { pattern: /b|h/,  defs: [  ] },
  { pattern: /c/,    defs: [  ] },
  { pattern: /d|v/,  defs: [  ] },
  { pattern: /ee|z/, defs: [  ] },
  { pattern: /f/,    defs: [  ] },
  { pattern: /p|t/,  defs: [  ] },
  { pattern: /m/,    defs: [  ] },
  { pattern: /s/,    defs: [  ] },
]


// Returns vehicle attributes for the given Ohm parse node of digits 5 and 6 of special tractive units
export const applyHauledPassenger_Serial = applyRules(HauledPassengerRules_Serial)

// Returns vehicle attributes for the given Ohm parse node of digits 7 and 8 of special tractive units
export const applyHauledPassenger_Index = applyRules(HauledPassengerRules_Index)
