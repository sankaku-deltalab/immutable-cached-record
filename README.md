# Immutable-Cached-Record

This is a library for creating immutable records. It is designed to be faster than Immutable.js Map when dealing with small data sizes.

## Usage

Here's a basic example of how to use this library:

```typescript
import {ICRecord} from "immutable-cached-record";

let record = ICRecord.create<string, number>({a: 1, b: 2});

// Update
record = ICRecord.put(record, "c", 3);  // New value will be added to cache.
record = ICRecord.putAll(record, {a: 10, d: 40});
record = ICRecord.remove(record, "c");  // Too slow. Do not use this.
record = ICRecord.mergeCache(record);  // Merge internal cache to main storage.

// Get
const v1 = ICRecord.fetch(record, "e");  // number | undefined
const v2 = ICRecord.fetchB(record, "a");  // number or Error thrown
const v3 = ICRecord.get(record, "e", -1);  // number or given default

// Enumerable operation
record = ICRecord.map(record, (v, _k) => v+1);
record = ICRecord.filter(record, (v, _k) => v % 2 === 0);
const pairArray = ICRecord.toArray(record);  // [string, number][]
const pairIterable = ICRecord.stream(record);  // Iterable<[string, number]>
```

## Benchmark

```bash
npm run benchmark
```

<details><summary>Benchmark result</summary>

```log
remove.ts
┌─────────┬─────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼─────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '8'     │ 113360312.49999994 │ '±3.65%' │ 10      │
│ 1       │ 'Immutable.Map' │ '467'   │ 2140208.617021259  │ '±3.26%' │ 47      │
└─────────┴─────────────────┴─────────┴────────────────────┴──────────┴─────────┘
put.ts
┌─────────┬─────────────────┬─────────┬───────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec │ Average Time (ns) │ Margin   │ Samples │
├─────────┼─────────────────┼─────────┼───────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '1,024' │ 976526.7961165415 │ '±3.11%' │ 103     │
│ 1       │ 'Immutable.Map' │ '1,253' │ 797627.8730158905 │ '±4.35%' │ 126     │
└─────────┴─────────────────┴─────────┴───────────────────┴──────────┴─────────┘
put-half.ts
┌─────────┬─────────────────┬─────────┬───────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec │ Average Time (ns) │ Margin   │ Samples │
├─────────┼─────────────────┼─────────┼───────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '2,494' │ 400811.7519999832 │ '±3.62%' │ 250     │
│ 1       │ 'Immutable.Map' │ '1,853' │ 539614.2419354918 │ '±4.49%' │ 186     │
└─────────┴─────────────────┴─────────┴───────────────────┴──────────┴─────────┘
merge-cache.ts
┌─────────┬────────────┬──────────┬───────────────────┬──────────┬─────────┐
│ (index) │ Task Name  │ ops/sec  │ Average Time (ns) │ Margin   │ Samples │
├─────────┼────────────┼──────────┼───────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord' │ '13,719' │ 72889.60641399045 │ '±1.65%' │ 1372    │
└─────────┴────────────┴──────────┴───────────────────┴──────────┴─────────┘
map.ts
┌─────────┬─────────────────┬─────────┬───────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec │ Average Time (ns) │ Margin   │ Samples │
├─────────┼─────────────────┼─────────┼───────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '8,599' │ 116287.9662790781 │ '±1.79%' │ 860     │
│ 1       │ 'Immutable.Map' │ '2,973' │ 336325.6375838981 │ '±4.10%' │ 298     │
└─────────┴─────────────────┴─────────┴───────────────────┴──────────┴─────────┘
filter.ts
┌─────────┬─────────────────┬─────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼─────────────────┼─────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '8,757' │ 114185.31285550958 │ '±2.63%' │ 879     │
│ 1       │ 'Immutable.Map' │ '4,400' │ 227232.40950225425 │ '±5.11%' │ 442     │
└─────────┴─────────────────┴─────────┴────────────────────┴──────────┴─────────┘
to-array.ts
┌─────────┬─────────────────┬──────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec  │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼─────────────────┼──────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '8,628'  │ 115896.70567788163 │ '±1.52%' │ 863     │
│ 1       │ 'Immutable.Map' │ '15,078' │ 66318.97612732908  │ '±5.94%' │ 1508    │
└─────────┴─────────────────┴──────────┴────────────────────┴──────────┴─────────┘
fetch.ts
┌─────────┬─────────────────┬──────────┬────────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec  │ Average Time (ns)  │ Margin   │ Samples │
├─────────┼─────────────────┼──────────┼────────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '95,589' │ 10461.370122398093 │ '±0.32%' │ 9559    │
│ 1       │ 'Immutable.Map' │ '21,768' │ 45938.69774919141  │ '±0.68%' │ 2177    │
└─────────┴─────────────────┴──────────┴────────────────────┴──────────┴─────────┘
create.ts
┌─────────┬─────────────────┬──────────────┬───────────────────┬──────────┬─────────┐
│ (index) │ Task Name       │ ops/sec      │ Average Time (ns) │ Margin   │ Samples │
├─────────┼─────────────────┼──────────────┼───────────────────┼──────────┼─────────┤
│ 0       │ 'ICRecord'      │ '14,656,532' │ 68.22896126910679 │ '±1.22%' │ 1465654 │
│ 1       │ 'Immutable.Map' │ '6,097'      │ 163993.7262294925 │ '±3.50%' │ 610     │
└─────────┴─────────────────┴──────────────┴───────────────────┴──────────┴─────────┘
```
</details>