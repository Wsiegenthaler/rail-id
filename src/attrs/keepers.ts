import { Field } from '.'
import { UICKeeperCodeMap, KeeperDef } from '../defs/keepers'
import { ParseWarnings } from './common'

const readableKeeper = (k: KeeperDef) => `${k.company} (${k.country}-${k.vkm})`

// Vehicle Owner (UIC VKM)
export const KeeperField = new Field<KeeperDef>('Vehicle Keeper', 'keeper', { readableFn: readableKeeper })

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