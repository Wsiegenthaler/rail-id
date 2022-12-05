import { SetField } from '..'
import { LoadLimitVal, VehicleLength, displayVehicleLength } from '../common-values'


// Load Limit (aka 'tu')
export const LoadLimit = new SetField<LoadLimitVal>('Load Limit', 'wagon.load')

// Inside Length (aka 'lu')
export const InsideLength = new SetField<VehicleLength>('Inside Length', 'wagon.length', {
  displayFn: displayVehicleLength
})