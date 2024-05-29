import * as Immutable from 'immutable';
import {ICRecord} from '../src';

const mapOriginal: Record<string, number> = {};
for (let i = 0; i < 1000; i++) {
  mapOriginal[i.toString()] = i;
}

let icr2 = ICRecord.create(mapOriginal);
for (let i = 0; i < 500; i++) {
  icr2 = ICRecord.put(icr2, i.toString(), i);
}

export const icr = icr2;
export const im = Immutable.Map(mapOriginal);
