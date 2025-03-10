import { IsTuple } from './IsTuple';

export type Callback<V = never, R = void> = [V] extends [never]
    ? () => R
    : IsTuple<V> extends true
    ? (...args: V extends unknown[] ? V : []) => R
    : (arg: V) => R;
