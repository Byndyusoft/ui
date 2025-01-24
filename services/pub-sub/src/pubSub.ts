type TDefaultChannels = Record<string, (data?: any) => void>;

type TChannelMap<ChannelsRecord extends TDefaultChannels> = Map<
    keyof ChannelsRecord,
    Set<ChannelsRecord[keyof ChannelsRecord]>
>;

type TPubSubInstances = Map<string, unknown>;

type TChannelData<ChannelsRecord extends TDefaultChannels, ChannelKey extends keyof ChannelsRecord> = Parameters<
    ChannelsRecord[ChannelKey]
>[0];

type ChannelsRecordAdapter<T> = { [K in keyof T]: T[K] };

const DEFAULT_NAME_INSTANCE = '_default';

class PubSub<ChannelsRecord extends TDefaultChannels> {
    private static instances: TPubSubInstances = new Map();
    private channels: TChannelMap<ChannelsRecord> = new Map();

    private constructor() {}

    /**
     * Getting an instance of a class.
     */
    static getInstance<ChannelsRecord extends TDefaultChannels>(
        instanceKey: string = DEFAULT_NAME_INSTANCE
    ): PubSub<ChannelsRecord> {
        if (!this.instances.get(instanceKey)) {
            this.instances.set(instanceKey, new PubSub<ChannelsRecord>());
        }

        return this.instances.get(instanceKey) as PubSub<ChannelsRecord>;
    }

    /**
     * Subscribe to the channel.
     */
    subscribe<ChannelKey extends keyof ChannelsRecord>(
        channel: ChannelKey,
        callback: ChannelsRecord[ChannelKey]
    ): void {
        if (!this.channels.has(channel)) {
            this.channels.set(channel, new Set());
        }
        (this.channels.get(channel) as Set<ChannelsRecord[ChannelKey]>).add(callback);
    }

    /**
     * Unsubscribe from the channel.
     */
    unsubscribe<ChannelKey extends keyof ChannelsRecord>(
        channel: ChannelKey,
        callback: ChannelsRecord[ChannelKey]
    ): void {
        const channelSet = this.channels.get(channel);
        if (channelSet) {
            channelSet.delete(callback);
            if (channelSet.size === 0) {
                this.channels.delete(channel);
            }
        }
    }

    /**
     * Publishing to the channel.
     */
    publish<ChannelKey extends keyof ChannelsRecord>(
        channel: ChannelKey,
        data?: TChannelData<ChannelsRecord, ChannelKey>
    ): void {
        const channelSet = this.channels.get(channel);
        if (channelSet) {
            for (const callback of channelSet) {
                callback(data);
            }
        } else {
            console.warn(`No subscribers for channel: ${channel as string}`);
        }
    }

    async publishAsync<ChannelKey extends keyof ChannelsRecord>(
        channel: ChannelKey,
        data?: TChannelData<ChannelsRecord, ChannelKey>
    ): Promise<void> {
        const channelSet = this.channels.get(channel);
        if (channelSet) {
            for (const callback of channelSet) {
                if (callback) {
                    await callback(data);
                }
            }
        } else {
            console.warn(`No subscribers for channel: ${channel as string}`);
        }
    }

    /**
     * Reset all subscriptions.
     */
    reset(): void {
        this.channels.clear();
    }
}

export type { ChannelsRecordAdapter };
export default PubSub;
