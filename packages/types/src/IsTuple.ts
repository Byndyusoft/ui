export type IsTuple<T> = T extends readonly unknown[]
    ? (number extends T['length'] ? false : true)
    : false;
