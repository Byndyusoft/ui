export type TDefaultChannels = Record<string, (data?: any) => void>;

export type TChannelMap<ChannelsRecord extends TDefaultChannels> = Map<
    keyof ChannelsRecord,
    Set<ChannelsRecord[keyof ChannelsRecord]>
>;

export type TPubSubInstances = Map<string, unknown>;

export type TChannelData<ChannelsRecord extends TDefaultChannels, ChannelKey extends keyof ChannelsRecord> = Parameters<
    ChannelsRecord[ChannelKey]
>[0];

export type ChannelsRecordAdapter<T> = { [K in keyof T]: T[K] };
