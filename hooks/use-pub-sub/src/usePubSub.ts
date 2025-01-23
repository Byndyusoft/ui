import React from 'react';
import { Callback } from '@byndyusoft-ui/types';

export type TRegistry = Record<string, Array<Callback>>;

type TUnsubscribe = Callback<[string, Callback]>;
type TSubscribe = Callback<[string, Callback]>;
type TPublish = Callback<string>;

const globalRegistry: TRegistry = {};

const makeUnsubscribe = (registry: TRegistry) => (channel: string, callback: Callback) => {
    if (!registry[channel]) return;

    const cbs = registry[channel];
    registry[channel] = cbs.filter(cb => cb !== callback);
};

const makeSubscribe = (registry: TRegistry) => (channel: string, callback: Callback) => {
    if (!registry[channel]) registry[channel] = [];

    const unsubscriber = () => makeUnsubscribe(registry)(channel, callback);

    const cbs = registry[channel];
    if (cbs.includes(callback)) return unsubscriber;

    registry[channel] = [...cbs, callback];

    return unsubscriber;
};

const makePublish = (registry: TRegistry) => (channel: string) => {
    if (!registry[channel]) return;

    registry[channel].forEach(cb => void cb());
};

const createPubSub = (
    scopedRegistry?: TRegistry
): {
    useSubscribe: TSubscribe;
    unsubscribe: TUnsubscribe;
    publish: TPublish;
} => {
    const registry = scopedRegistry ?? globalRegistry;

    const useSubscribe = (channel: string, callback: Callback) => {
        React.useEffect(() => makeSubscribe(registry)(channel, callback), [channel, callback]);
    };

    return {
        useSubscribe,
        publish: makePublish(registry),
        unsubscribe: makeUnsubscribe(registry)
    };
};

export default createPubSub;
