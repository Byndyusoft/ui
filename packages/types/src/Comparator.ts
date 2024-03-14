export type ComparatorResult = -1 | 0 | 1;

export type Comparator<T> = (left: T, right: T) => ComparatorResult;
