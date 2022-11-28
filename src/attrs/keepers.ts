import { Field } from '.'
import { UICKeeperCodeMap, KeeperDef } from '../defs/keepers'
import { ParseWarnings } from './common'

const displayKeeper = (k: KeeperDef) => `${k.company} (${k.country}-${k.vkm})`

// Vehicle Owner (UIC VKM)
export const KeeperField = new Field<KeeperDef>('Vehicle Keeper', 'keeper', {
  displayFn: displayKeeper,
  desc: 'The Vehicle Keeper Marking (VKM) is used to uniquely identify the internationally registered vehicle operator. Note that the keeper will be different from the owner of a vehicle when a leasing agreement is in force.'
})

export const KeeperByCode = (vkm: string) => {
  const def = UICKeeperCodeMap[vkm]
  if (def === undefined) {
    return ParseWarnings.value({
      type: 'unknown-value',
      subType: 'unknown-keeper',
      msg: `Vehicle Keeper Marking '${vkm}' doesn't appear to be a known value`
    })
  } else {
    return KeeperField.value(def)
  }
}