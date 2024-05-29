/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr as icr2} from './utils';

const icr = ICRecord.put(icr2, '0', 1);

const bench = new Bench({time: 100});

bench.add('ICRecord', () => {
  ICRecord.mergeCache(icr);
});

const run = async () => {
  await bench.warmup();
  await bench.run();

  console.log('merge-cache.ts');
  console.table(bench.table());
};

run();
