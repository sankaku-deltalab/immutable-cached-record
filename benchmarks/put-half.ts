/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr as icr2, im as im2} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    let icr = icr2;
    for (let i = 0; i < 500; i++) {
      icr = ICRecord.put(icr, i.toString(), i + 1);
    }
    ICRecord.mergeCache(icr);
  })
  .add('Immutable.Map', async () => {
    let im = im2;
    for (let i = 0; i < 500; i++) {
      im = im.set(i.toString(), i + 1);
    }
  });

const run = async () => {
  await bench.warmup();
  await bench.run();

  console.log('put-half.ts');
  console.table(bench.table());
};

run();
