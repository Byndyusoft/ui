export type TSerializer<V> = (value: V) => string;

export type TDeserializer<V> = (value: string) => V;
