type IsTuple<T> = T extends readonly unknown[]
  ? (T['length'] extends number
    ? (number extends T['length'] ? false : true)
    : false)
  : false;



type Callback<V, R = void> = IsTuple<V> extends true
  ? (...args: V extends unknown[] ? V : []) => R
  : (arg: V) => R;
