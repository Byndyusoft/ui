export type TSerializeValue<V> = (value: V) => string;

export type TDeserializeValue<V> = (value: string) => V;

export interface IOptions<V> {
    serialize?: TSerializeValue<V>;
    deserialize?: TDeserializeValue<V>;
}
