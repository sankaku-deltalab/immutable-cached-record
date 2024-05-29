/**
 * Immutable Cached Record.
 *
 * This is a simple data structure that allows you to store a map of key-value pairs.
 * It is immutable, meaning that all operations return a new instance of the record.
 * It also has a cache that stores changes to the map.
 */
export type ICRecord<K extends string | number, V> = {
  /** Main storage. */
  readonly map: ReadonlyRecord<K, V>;

  /** Cache for changes. */
  readonly cache: ReadonlyRecord<K, V>;
};

type ReadonlyRecord<K extends string | number, V> = {
  readonly [P in K]: V;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ICRecord {
  /**
   * Create a new record.
   *
   * Example:
   * ```ts
   * const recordEmpty = ICRecord.create();
   * const record = ICRecord.create({a: 1, b: 2});
   * ```
   */
  export function create<K extends string | number, V>(
    map?: Record<K, V>
  ): ICRecord<K, V> {
    return {
      map: map ?? ({} as ReadonlyRecord<K, V>),
      cache: {} as ReadonlyRecord<K, V>,
    };
  }

  /**
   * Get a value from the record.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * ICRecord.fetch(record, 'a'); // 1
   * ICRecord.fetch(record, 'c'); // undefined
   * ```
   */
  export function fetch<K extends string | number, V>(
    record: ICRecord<K, V>,
    key: K
  ): V | undefined {
    return record.cache[key] ?? record.map[key];
  }

  /**
   * Get a value from the record.
   * If record does not have the key, throw an error.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * ICRecord.fetchB(record, 'a'); // 1
   * // ICRecord.fetchB(record, 'c');  // Error: Key not found: c
   * ```
   */
  export function fetchB<K extends string | number, V>(
    record: ICRecord<K, V>,
    key: K
  ): V {
    const value = fetch(record, key);
    if (value === undefined) {
      throw new Error(`Key not found: ${key}`);
    }
    return value;
  }

  /**
   * Get a value from the record.
   * If record does not have the key, return a default value.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const value = ICRecord.fetch(record, 'a', 0); // 1
   * const value2 = ICRecord.fetch(record, 'c', 0); // 0
   * ```
   */
  export function get<K extends string | number, V>(
    record: ICRecord<K, V>,
    key: K,
    defaultValue: V
  ): V {
    return fetch(record, key) ?? defaultValue;
  }

  /**
   * Put a value into the record.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.put(record, 'b', 3);
   * const record3 = ICRecord.put(record, 'c', 4);
   * ```
   */
  export function put<K extends string | number, V>(
    record: ICRecord<K, V>,
    key: K,
    value: V
  ): ICRecord<K, V> {
    return {
      map: record.map,
      cache: {...record.cache, [key]: value},
    };
  }

  /**
   * Put multiple values into the record.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.putAll(record, {c: 3, d: 4});
   * ```
   */
  export function putAll<K extends string | number, V>(
    record: ICRecord<K, V>,
    map: Record<K, V>
  ): ICRecord<K, V> {
    return {
      map: record.map,
      cache: {...record.cache, ...map},
    };
  }

  /**
   * Remove a value from the record.
   *
   * WARN: This operation is not cached.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.remove(record, 'b');
   * const record3 = ICRecord.remove(record, 'c');
   * ```
   */
  export function remove<K extends string | number, V>(
    record: ICRecord<K, V>,
    key: K
  ): ICRecord<K, V> {
    const {[key]: _, ...newMap} = record.map;
    const {[key]: __, ...newCache} = record.cache;
    return {
      map: newMap as ReadonlyRecord<K, V>,
      cache: newCache as ReadonlyRecord<K, V>,
    };
  }

  /**
   * Merge the cache into the map.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.put(record, 'b', 3);
   * const record3 = ICRecord.mergeCache(record2);
   * ```
   */
  export function mergeCache<K extends string | number, V>(
    record: ICRecord<K, V>
  ): ICRecord<K, V> {
    return {
      map: {...record.map, ...record.cache},
      cache: {} as ReadonlyRecord<K, V>,
    };
  }

  /**
   * Map over the record.
   *
   * NOTE: This operation merges the cache.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.map(record, (value, key) => value * 2);
   * ```
   */
  export function map<K extends string | number, V>(
    record: ICRecord<K, V>,
    fn: (value: V, key: K) => V
  ): ICRecord<K, V> {
    const r2 = mergeCache(record);
    const newMap = {} as Record<K, V>;
    for (const key in r2.map) {
      newMap[key] = fn(r2.map[key], key as K);
    }
    return create(newMap);
  }

  /**
   * Filter the record.
   *
   * NOTE: This operation merges the cache.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const record2 = ICRecord.filter(record, (value, key) => value % 2 === 0);
   * ```
   */
  export function filter<K extends string | number, V>(
    record: ICRecord<K, V>,
    fn: (value: V, key: K) => boolean
  ): ICRecord<K, V> {
    const r2 = mergeCache(record);
    const newMap = {} as Record<K, V>;
    for (const key in r2.map) {
      if (fn(r2.map[key], key as K)) {
        newMap[key] = r2.map[key];
      }
    }
    return create(newMap);
  }

  /**
   * Iterate the record.
   *
   * NOTE: This operation merges the cache but does not return a new record.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * for (const [key, value] of ICRecord.stream(record)) {
   *  console.log(key, value);  // a 1, b 2
   * }
   * ```
   */
  export function stream<K extends string | number, V>(
    record: ICRecord<K, V>
  ): Iterable<[K, V]> {
    const r2 = mergeCache(record);
    return Object.entries(r2.map) as Iterable<[K, V]>;
  }

  /**
   * Convert the record to an array.
   *
   * NOTE: This operation merges the cache but does not return a new record.
   *
   * Example:
   * ```ts
   * const record = ICRecord.create({a: 1, b: 2});
   * const array = ICRecord.toArray(record); // [['a', 1], ['b', 2]]
   * ```
   */
  export function toArray<K extends string | number, V>(
    record: ICRecord<K, V>
  ): [K, V][] {
    return [...stream(record)];
  }
}
