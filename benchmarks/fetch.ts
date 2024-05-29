/* eslint-disable node/no-extraneous-import */
import {Bench} from 'tinybench';
import {ICRecord} from '../src';
import {icr, im, size} from './utils';

const bench = new Bench({time: 100});

bench
  .add('ICRecord', () => {
    for (let i = 0; i < size; i++) {
      ICRecord.fetch(icr, i.toString());
    }
  })
  .add('Immutable.Map', async () => {
    for (let i = 0; i < size; i++) {
      im.get(i.toString());
    }
  });

const run = async () => {
  await bench.warmup();
  await bench.run();

  console.log('fetch.ts');
  console.table(bench.table());
};

run();
