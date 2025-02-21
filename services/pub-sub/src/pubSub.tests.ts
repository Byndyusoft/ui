import PubSub from './pubSub';

type TChannels = {
    testChannel: (data?: string) => void;
    asyncChannel: (data?: string) => Promise<void>;
};

describe('services/pub-sub', () => {
    const pubSub = new PubSub<TChannels>();

    afterEach(() => {
        pubSub.reset();
    });

    test('should subscribe and publish to a channel', () => {
        const callback = jest.fn();
        pubSub.subscribe('testChannel', callback);

        pubSub.publish('testChannel', 'Hello, World!');

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('Hello, World!');
    });

    test('should not call callback if no subscribers', () => {
        const callback = jest.fn();
        pubSub.publish('testChannel');

        expect(callback).not.toHaveBeenCalled();
    });

    test('should unsubscribe from a channel', () => {
        const callback = jest.fn();
        pubSub.subscribe('testChannel', callback);
        pubSub.unsubscribe('testChannel', callback);

        pubSub.publish('testChannel');

        expect(callback).not.toHaveBeenCalled();
    });

    test('should warn if no subscribers are present for a channel', () => {
        console.warn = jest.fn();

        pubSub.publish('testChannel', 'No one is listening');

        expect(console.warn).toHaveBeenCalledWith('No subscribers for channel: testChannel');
    });

    test('should handle async subscribe callbacks', async () => {
        const asyncCallback = jest.fn().mockResolvedValue(undefined);
        pubSub.subscribe('asyncChannel', asyncCallback);

        await pubSub.publishAsync('asyncChannel', 'Async data');

        expect(asyncCallback).toHaveBeenCalledTimes(1);
        expect(asyncCallback).toHaveBeenCalledWith('Async data');
    });

    test('should reset all subscriptions', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        pubSub.subscribe('testChannel', callback1);
        pubSub.subscribe('testChannel', callback2);

        pubSub.reset();

        pubSub.publish('testChannel');

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
    });

    test('should unsubscribe all callbacks for all channels using unsubscribeAll', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        pubSub.subscribe('testChannel', callback1);
        pubSub.subscribe('asyncChannel', callback2);

        pubSub.unsubscribeAll();

        pubSub.publish('testChannel', 'Test data');
        pubSub.publish('asyncChannel', 'Test data');

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
    });

    test('should call subscribeOnce callback only once', () => {
        const callback = jest.fn();
        pubSub.subscribeOnce('testChannel', callback);

        // First publish should trigger the callback.
        pubSub.publish('testChannel', 'Test message 1');

        // Subsequent publish should not trigger the callback.
        pubSub.publish('testChannel', 'Test message 2');

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('Test message 1');
    });

    test('should return all subscriptions info', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        pubSub.subscribe('testChannel', callback1);
        pubSub.subscribe('testChannel', callback2);
        pubSub.subscribe('asyncChannel', callback1);

        const result = pubSub.allSubscribes();

        const testChannelInfo = result.find(item => item.channel === 'testChannel');
        const asyncChannelInfo = result.find(item => item.channel === 'asyncChannel');

        expect(testChannelInfo).toBeDefined();
        expect(testChannelInfo!.subscribers).toBe(2);

        expect(asyncChannelInfo).toBeDefined();
        expect(asyncChannelInfo!.subscribers).toBe(1);
    });
});
