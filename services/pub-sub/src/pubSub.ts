import { TChannelData, TChannelMap, TDefaultChannels } from './pubSub.types';

class PubSub<ChannelsRecord extends TDefaultChannels<ChannelsRecord>> {
    private channels: TChannelMap<ChannelsRecord> = new Map();

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
     * Unsubscribe all callbacks for a specific channel or all channels.
     */
    unsubscribeAll = <ChannelKey extends keyof ChannelsRecord>(channel?: ChannelKey): void => {
        if (channel) {
            this.channels.delete(channel);
        } else {
            this.channels.clear();
        }
    };

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
            console.warn(`No subscribers for channel: ${String(channel)}`);
        }
    }

    async publishAsync<ChannelKey extends keyof ChannelsRecord>(
        channel: ChannelKey,
        data?: TChannelData<ChannelsRecord, ChannelKey>
    ): Promise<void> {
        const channelSet = this.channels.get(channel);

        if (!channelSet) {
            console.warn(`No subscribers for channel: ${String(channel)}`);
            return;
        }

        const promises = Array.from(channelSet).map(callback => Promise.resolve(callback(data)));

        await Promise.all(promises);
    }

    /**
     * Reset all subscriptions.
     */
    reset(): void {
        this.channels.clear();
    }
}

export default PubSub;
