export type Callback<V, R = void> = V extends unknown[] ? (...args: V) => R : (arg: V) => R;
