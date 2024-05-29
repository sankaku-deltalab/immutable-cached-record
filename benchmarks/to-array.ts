/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr, im} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    ICRecord.toArray(icr);
  })
  .add('Immutable.Map', async () => {
    im.toArray();
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.log('to-array.ts');
  console.table(bench.table());
};

run();
