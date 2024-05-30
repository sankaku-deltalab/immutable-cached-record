/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {rec, icr, im} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    ICRecord.map(icr, (v, _k) => v + 1);
  })
  .add('Vanilla Record', () => {
    Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, v + 1]));
  })
  .add('Immutable.Map', async () => {
    im.map((v, _k) => v + 1);
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.log('map.ts');
  console.table(bench.table());
};

run();
