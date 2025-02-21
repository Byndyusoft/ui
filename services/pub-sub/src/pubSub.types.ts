type TChannelHandler = (data?: any) => void;

export type TDefaultChannels<ChannelsRecord> = { [K in keyof ChannelsRecord]: TChannelHandler };

export type TChannelMap<ChannelsRecord extends TDefaultChannels<ChannelsRecord>> = Map<
    keyof ChannelsRecord,
    Set<ChannelsRecord[keyof ChannelsRecord]>
>;

export type TChannelData<
    ChannelsRecord extends TDefaultChannels<ChannelsRecord>,
    ChannelKey extends keyof ChannelsRecord
> = Parameters<ChannelsRecord[ChannelKey]>[0];

export type TAllSubscribesResult<ChannelsRecord> = Array<{
    channel: keyof ChannelsRecord;
    subscribers: number;
}>;
