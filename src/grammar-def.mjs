import { range, some } from 'lodash-es'

import { UICTypeRules } from './uic/types.mjs'
import { UICCountries } from './uic/countries.mjs'

// Generate UIC type code clause based on type rule definitions
const types = range(0, 100)
  .map(n => n.toString().padStart(2, '0'))
  .filter(digits => some(UICTypeRules, r => r.pattern.test(digits) && r.exact))
  .map(digits => ` "${digits[0]}" spaces "${digits[1]}"  -- type${digits}`)
  .join('\n  |')

// Generate country clause based on UIC country definitions
const countries = UICCountries
  .map(c => ({ digits: c.code.toString().split(''), ...c }))
  .map(c => ` "${c.digits[0]}" spaces "${c.digits[1]}" // ${c.long}`)
  .join('\n  |')

export default `
  SBBGrammar {
  
    SBBCode
      = UICLong
      | legacyPrefix modernSuffix -- mixed
      | legacyPrefix LegacySuffix -- legacyFull
      | legacyPrefix              -- legacyPrefixOnly
      | modernSuffix
   
    vehicleCode = locomotiveCode | railcarCode
 
    legacyPrefix = vehicleCode tractionCode
    
    // ------------------------------------------------------------
    // Legacy Suffix
    // ------------------------------------------------------------
 
    LegacySuffix = LegacyAxles? legacySeries?
    LegacyAxles = legacyAxlesDrive ("/" legacyAxlesTotal)?
    legacyAxlesDrive = digit+
    legacyAxlesTotal = digit+
 
    legacySeries
      = caseInsensitive<"VIII">
      | caseInsensitive<"III">
      | caseInsensitive<"VII">
      | caseInsensitive<"II">
      | caseInsensitive<"IV">
      | caseInsensitive<"VI">
      | caseInsensitive<"IX">
      | caseInsensitive<"I">
      | caseInsensitive<"V">
      | caseInsensitive<"X">
 
    // ------------------------------------------------------------
    // UIC
    // ------------------------------------------------------------
 
    UICLong
      = UICPrefix UICRegional UICKeeper
      | UICKeeper UICPrefix UICRegional
      | UICPrefix UICRegional
    UICPrefix = UICType UICCountry
    UICType = ${types}
    UICCountry = ${countries}
    UICRegional = UICRegional1 UICRegional2 UICChecksum?
    UICRegional1 = UICRegional1a UICRegional1b
    UICRegional1a = UICDigit
    UICRegional1b = UICDigit UICDigit UICDigit
    UICRegional2 = UICDigit UICDigit UICDigit
    UICChecksum = "-" UICDigit
    UICKeeper = letter letter? letter? "-" letter letter? letter? letter?
    UICDigit = digit
 
 
    // ------------------------------------------------------------
    // Modern Suffix
    // ------------------------------------------------------------
 
    modernSuffix = modernSuffixCode1 (space* modernSuffixCode2 (space* "-" space* modernSuffixCodeExt)?)?
    modernSuffixCode1 = digit digit digit
    modernSuffixCode2 = digit digit digit
    modernSuffixCodeExt = digit
      
    // ------------------------------------------------------------
    // Locomotive
    // ------------------------------------------------------------
    
    locomotiveCode = locomotiveToken+ ~railcarToken_All  // Lookahead prevents matching locomotive prefix when railcar tokens are present
    
    locomotiveToken
      = "A"  -- A  // Standard gauge locomotive with v max over 80 km/h
      | "B"  -- B  // Standard gauge locomotive with v max from 70 to 80 km/h
      | "C"  -- C  // Standard gauge locomotive with v max of 60 and 65 km/h
      | "D"  -- D  // Standard gauge locomotive with v max from 45 to 55 km/h
      | "E"  -- E  // Shunting locomotive, steam tender locomotive
      | "f"  -- f  // Electric locomotives (until 1920 only)
      | "G"  -- G  // Narrow-gauge locomotive for adhesion operation
      | "H"  -- H  // Gear drive locomotive
      | "R"  -- R  // Locomotive with increased cornering speed ( train series R) and v max at least 110 km/h (only with standard gauge)
      | "T"  -- T  // Tractor, fireless steam locomotive
 
    // ------------------------------------------------------------
    // Railcar
    // ------------------------------------------------------------
    
    railcarCode
      = ((railcarToken_Cornering | railcarToken_General)* railcarToken_AB (railcarToken_Restaurant | railcarToken_General | railcarToken_AB)*) -- TODO
      | (railcarToken_Cornering | railcarToken_General)+
 
    railcarToken_All = railcarToken_General | railcarToken_AB | railcarToken_Restaurant | railcarToken_Cornering
    
    railcarToken_General
      = "C"           -- C       // Railcar with third class compartment (before 1956)
      | "D"           -- D       // Railcar with luggage compartment (since 1962)
      | "f"           -- f       // Railcar with luggage compartment (until 1961)
      | "K"           -- K       // Closed railcar (all Ke were later redrawn to Fe)
      | "L"           -- L       // Initially used to designate light railcars ( red arrows ), e.g. B. CLe 2/4
      | "O"           -- O       // Gondola (Ohe 1/2 31 of the Pilatusbahn)
      | "S"           -- S       // Special compartment
      | "ST"          -- ST      // Self-propelled container wagon (CargoSprinter)
      | "X"           -- X       // Service vehicle
      | ("XT" | "VT") -- XT      // Self-driving company car
      | "Z"           -- Z       // Railcar with mail compartment
      
    railcarToken_AB 
      = ("A" | "As")  -- A       // Railcar with first-class compartment or saloon compartment
      | "B"           -- B       // Railcar with second class compartment
 
    railcarToken_Cornering = "R" // Railcars with increased cornering speed and v max at least 110 km/h (only for standard gauge)
 
    railcarToken_Restaurant = ("R" | "r")  // Restaurant, buffet (after A or B)
 
    
    // ------------------------------------------------------------
    // Traction
    // ------------------------------------------------------------
   
    tractionCode = tractionToken*
    
    tractionToken
      = "a"  -- a  // Accumulator
      | "e"  -- e  // Electric
      | "f"  -- f  // Radio remote control (unofficial extension)
      | "H"  -- H  // Gear drive (on railcars and tractors)
      | "m"  -- m  // Thermal (diesel, gas turbine)
 
    //tractionCode = tractionToken+
    
    //tractionToken
    //  = "a"  -- a  // Accumulator
    //  | "e"  -- e  // Electric
    //  | "f"  -- f  // Radio remote control (unofficial extension)
    //  | "H"  -- H  // Gear drive (on railcars and tractors)
    //  | "m"  -- m  // Thermal (diesel, gas turbine)

  }
`
