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
});
