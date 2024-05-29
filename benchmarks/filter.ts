/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr, im} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    ICRecord.filter(icr, (v, _k) => v % 2 === 0);
  })
  .add('Immutable.Map', async () => {
    im.filter((v, _k) => v % 2 === 0);
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.log('filter.ts');
  console.table(bench.table());
};

run();
