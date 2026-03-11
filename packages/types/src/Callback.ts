export type Callback<V = never, R = void> = [V] extends [never]
    ? () => R
    : V extends unknown[]
    ? (...args: V) => R
    : (arg: V) => R;
