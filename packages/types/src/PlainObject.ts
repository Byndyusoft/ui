import { PropertyKey } from './PropertyKey';

export type PlainObject<T = unknown> = Record<PropertyKey, T>;
