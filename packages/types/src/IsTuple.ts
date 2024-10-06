export type IsTuple<T> = T extends readonly unknown[]
  ? (T['length'] extends number
    ? (number extends T['length'] ? false : true)
    : false)
  : false;
