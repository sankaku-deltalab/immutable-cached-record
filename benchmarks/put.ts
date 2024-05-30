/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {rec as rec2, icr as icr2, im as im2, size} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    let icr = icr2;
    for (let i = 0; i < size; i++) {
      icr = ICRecord.put(icr, i.toString(), i + 1);
    }
    ICRecord.mergeCache(icr);
  })
  .add('Vanilla Record', () => {
    let rec = rec2;
    for (let i = 0; i < size; i++) {
      rec = {...rec, [i.toString()]: i + 1};
    }
  })
  .add('Immutable.Map', async () => {
    let im = im2;
    for (let i = 0; i < size; i++) {
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
