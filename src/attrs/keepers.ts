import { Field } from '.'
import { UICKeeperCodeMap, KeeperDef } from '../defs/keepers'
import { ParseWarnings } from './common'

// Vehicle Owner (UIC VKM)
const KeeperField = new Field<KeeperDef>('Vehicle Keeper', 'keeper')

export const KeeperByCode = (vkm: string) => {
  const def = UICKeeperCodeMap[vkm]
  if (def === undefined) {
    return ParseWarnings.value(`Vehicle Keeper Marking '${vkm}' doesn't appear to be a known value.`)
  } else {
    return KeeperField.value(def)
  }
}