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
    const icr = ICRecord.create(mapOriginal);
    ICRecord.map(icr, (v, _k) => v + 1);
  })
  .add('Immutable.Map', async () => {
    const im = Immutable.Map(mapOriginal);
    im.map((v, _k) => v + 1);
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.table(bench.table());
};

run();
