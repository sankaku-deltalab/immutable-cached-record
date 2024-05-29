/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import * as Immutable from 'immutable';
import {ICRecord} from '../src';

const mapOriginal: Record<string, number> = {};
for (let i = 0; i < 1000; i++) {
  mapOriginal[i.toString()] = i;
}

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    let icr = ICRecord.create(mapOriginal);
    for (let i = 0; i < 1000; i++) {
      icr = ICRecord.put(icr, i.toString(), i + 1);
    }
    ICRecord.mergeCache(icr);
  })
  .add('Immutable.Map', async () => {
    let im = Immutable.Map(mapOriginal);
    for (let i = 0; i < 1000; i++) {
      im = im.set(i.toString(), i + 1);
    }
  });

const run = async () => {
  await bench.warmup();
  await bench.run();

  console.log('put.ts');
  console.table(bench.table());
};

run();
