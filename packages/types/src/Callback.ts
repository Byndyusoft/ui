import { IsTuple } from "./IsTuple";

export type Callback<V = never, R = void> = IsTuple<V> extends true
  ? (...args: V extends unknown[] ? V : []) => R
  : (arg: V) => R;
