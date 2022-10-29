import { range, some, values } from 'lodash-es'

import { UICCountries } from './countries.mjs'
import { UICWagonTypeRules, UICPassengerTypeRules } from './types.mjs'


// Generate country clause based on UIC country definitions
const countries = UICCountries
  .map(c => ({ digits: c.code.toString().split(''), ...c }))
  .map(c => `"${c.digits[0]}" "${c.digits[1]}" // ${c.long}`)
  .join('\n    | ')

// Facility for generating UIC type code clauses based on type rule definitions
const exactTypeRules = rules => rules.filter(r => !r.pattern.toString().includes('.')) // ignore rules with wildcards
const typeClause = rules => range(0, 100)
  .map(n => n.toString().padStart(2, '0'))
  .filter(dd => some(rules, r => r.pattern.test(dd)))
  .map(dd => `"${dd[0]}" "${dd[1]}"  -- type${dd}`)
  .join('\n    | ')

// UIC type code clause for wagons
const exactWagonTypeRules = exactTypeRules(UICWagonTypeRules)
const wagonTypeClause = typeClause(exactWagonTypeRules)

// UIC type code clause for passenger cars
const exactPassengerTypeRules = exactTypeRules(UICPassengerTypeRules)
const passengerTypeClause = typeClause(exactPassengerTypeRules)


export default `
UICCode {

  // ------------------------------------------------------------
  // UIC
  // ------------------------------------------------------------
 
  UICCode = UICCodeInner<UICCountriesAll>

  UICCodeInner<country>
    = UICWagon<country>
    | UICPassenger<country>
    | UICTractive<country>
    | UICSpecial<country>


  // ------ Top-level Patterns ----------------------------------------------------------

  UICWagon<country> =     CodePattern4<UICWagonType,     country, UICWagonDetail,     UICSerial, UICWagonFreeToken>
  UICPassenger<country> = CodePattern4<UICPassengerType, country, UICPassengerDetail, UICSerial, UICPassengerFreeToken>
  UICTractive<country> =  CodePattern3<UICTractiveType,  country, UICTractiveDetail,  UICTractiveFreeToken>
  UICSpecial<country> =   CodePattern4<UICSpecialType,   country, UICSpecialDetail,   UICSerial, UICSpecialFreeToken>


  // ------ Type Code -------------------------------------------------------------------

  UICWagonType
    = ${wagonTypeClause}
    
  UICPassengerType
    = ${passengerTypeClause}
    
  UICTractiveType
    = "9" xs "0"  -- type90
    | "9" xs "1"  -- type91
    | "9" xs "2"  -- type92
    | "9" xs "3"  -- type93
    | "9" xs "4"  -- type94
    | "9" xs "5"  -- type95
    | "9" xs "6"  -- type96
    | "9" xs "7"  -- type97
    | "9" xs "8"  -- type98
    
  UICSpecialType = "9" xs "9"


  // ------ Country ---------------------------------------------------------------------

  UICCountriesAll
    = ${countries}


  // ------ Detail ---------------------------------------------------------------------

  UICWagonDetail = digit xs digit xs digit xs digit

  UICPassengerDetail = digit xs digit xs digit xs digit

  UICTractiveDetail
    = "0" xs digit xs digit xs digit xs digit xs digit xs digit
    | "1" xs digit xs digit xs digit xs digit xs digit xs digit
    | "2" xs digit xs digit xs digit xs digit xs digit xs digit
    | "3" xs digit xs digit xs digit xs digit xs digit xs digit
    | "4" xs digit xs digit xs digit xs digit xs digit xs digit
    | "5" xs digit xs digit xs digit xs digit xs digit xs digit
    | "6" xs digit xs digit xs digit xs digit xs digit xs digit
    | "7" xs digit xs digit xs digit xs digit xs digit xs digit
    | "8" xs digit xs digit xs digit xs digit xs digit xs digit

  UICSpecialDetail = "9" xs digit xs digit xs digit


  // ------ Other -----------------------------------------------------------------------

  UICSerial = digit xs digit xs digit

  UICChecksum = "-" digit

  UICKeeper = upper upper? "-" upper upper? upper? upper? upper?

  // Tokens that may appear in any number of places throught the code
  UICWagonFreeToken =     "RIV" | UICKeeper
  UICPassengerFreeToken = "TEN" | UICKeeper
  UICTractiveFreeToken =  UICKeeper
  UICSpecialFreeToken =   UICKeeper


  // ------ Utility ---------------------------------------------------------------------

  // Extended whitespace which includes certain punctuation
  x = "-" | "." | "," | space
  xs = x*

  xt<token> = xs token  // Token which may appear with extended whitespace before

  // 3-part pattern template
  CodePattern3<type, country, detail, free>
    = xt<free>* xt<type> xt<free>* xt<country> xt<free>* xt<detail> UICChecksum? xs xt<free>*

  // 4-part pattern template
  CodePattern4<type, country, detail1, detail2, free>
    = xt<free>* xt<type> xt<free>* xt<country> xt<free>* xt<detail1> xt<detail2> UICChecksum? xs xt<free>*

}`