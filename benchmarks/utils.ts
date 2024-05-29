import * as Immutable from 'immutable';
import {ICRecord} from '../src';

export const size = 1_000;
export const sizeHalf = Math.floor(size / 2);

const mapOriginal: Record<string, number> = {};
for (let i = 0; i < size; i++) {
  mapOriginal[i.toString()] = i;
}

let icr2 = ICRecord.create(mapOriginal);
// Add half of the items to the cache
for (let i = 0; i < sizeHalf; i++) {
  icr2 = ICRecord.put(icr2, i.toString(), i);
}

export const icr = icr2;
export const im = Immutable.Map(mapOriginal);
