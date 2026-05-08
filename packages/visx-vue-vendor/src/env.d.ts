declare module "internmap" {
  export class InternMap<K, V> extends Map<K, V> {
    constructor(entries?: Iterable<readonly [K, V]> | null, key?: (key: K) => any);
  }
  export class InternSet<T> extends Set<T> {
    constructor(values?: Iterable<T> | null, key?: (value: T) => any);
  }
}
