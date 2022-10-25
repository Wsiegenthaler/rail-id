import test from 'ava'

import { eq, like } from './util.mjs'


test('whitespace 1', t => {
  let expected = {
    fastCornering: true,
    trackGauge: 'standard',
    vmax: '70-80 km/h',
    battery: true,
    electric: true,
    axlesDrive: '4',
    axlesTotal: '6',
    series: 3,
    meta: { codeType: 'sbb', codeVariant: 'legacy' }
  }

  eq('RABae 4/6 III', expected)(t)
  eq('RABae 4/ 6 III', expected)(t)
  eq('RABae 4 / 6 III', expected)(t)
  eq('	RABae 4/6III ', expected)(t)
  eq('   RABae	4/6	III ', expected)(t)
})

test('lots of flags', t => {
  let expected = {
	fastCornering: true,
    trackGauge: 'standard',
    vmax: '70-80 km/h',
    battery: true,
    electric: true,
    radioControlled: true,
    gearDrive: true,
    fuel: true,
    axlesDrive: '4',
    axlesTotal: '6',
    series: 2,
	  meta: { codeType: 'sbb', codeVariant: 'legacy' }
  }

  eq('RABaefHm 4/6 II', expected)(t)
})
