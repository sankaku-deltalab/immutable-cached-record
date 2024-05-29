/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import * as Immutable from 'immutable';
import {ICRecord} from '../src';
import {size} from './utils';

const mapOriginal: Record<string, number> = {};
for (let i = 0; i < size; i++) {
  mapOriginal[i.toString()] = i;
}

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    ICRecord.create(mapOriginal);
  })
  .add('Immutable.Map', async () => {
    Immutable.Map(mapOriginal);
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.log('create.ts');
  console.table(bench.table());
};

run();
