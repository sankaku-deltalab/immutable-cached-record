/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr as icr2, im as im2} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    let icr = icr2;
    for (let i = 0; i < 1000; i++) {
      icr = ICRecord.remove(icr, i.toString());
    }
    ICRecord.mergeCache(icr);
  })
  .add('Immutable.Map', async () => {
    let im = im2;
    for (let i = 0; i < 1000; i++) {
      im = im.remove(i.toString());
    }
  });

const run = async () => {
  await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run();

  console.log('remove.ts');
  console.table(bench.table());
};

run();
