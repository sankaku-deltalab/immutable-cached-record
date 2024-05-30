/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {rec as rec2, icr as icr2, im as im2, size} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    let icr = icr2;
    for (let i = 0; i < size; i++) {
      icr = ICRecord.remove(icr, i.toString());
    }
    ICRecord.mergeCache(icr);
  })
  .add('Vanilla Record', () => {
    let rec = rec2;
    // immutable delete
    for (let i = 0; i < size; i++) {
      const {[i.toString()]: _, ...rest} = rec;
      rec = rest;
    }
  })
  .add('Immutable.Map', async () => {
    let im = im2;
    for (let i = 0; i < size; i++) {
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
