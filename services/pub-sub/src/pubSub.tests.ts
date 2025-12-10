import PubSub from './pubSub';

describe('services/pub-sub', () => {
    const pubSub = new PubSub();

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

        const result = pubSub.getAllSubscribers();

        const testChannelInfo = result.find(item => item.event === 'testChannel');
        const asyncChannelInfo = result.find(item => item.event === 'asyncChannel');

        expect(testChannelInfo).toBeDefined();

        expect(testChannelInfo?.subscribers.length).toBe(2);

        expect(asyncChannelInfo).toBeDefined();

        expect(asyncChannelInfo?.subscribers.length).toBe(1);
    });

    test('should enforce typed events and callbacks', async () => {
        type ProgressPayload = { type: 'progress'; value: number };
        type CompletePayload = { type: 'complete'; message: string };
        type Channels = {
            addTodo: (data: { id: number; text: string }) => void;
            clearTodos: () => void;
            notifyAsync: (data: string) => Promise<void>;
            status: ((payload: ProgressPayload) => void) | ((payload: CompletePayload) => number);
        };

        const typedPubSub = new PubSub<Channels>();

        const addTodoCallback = jest.fn<ReturnType<Channels['addTodo']>, Parameters<Channels['addTodo']>>();
        const clearTodosCallback = jest.fn();
        const progressSpy = jest.fn();
        const completeSpy = jest.fn();
        const onProgress = jest.fn((payload: ProgressPayload) => {
            if (payload.type === 'progress') {
                progressSpy(payload.value);
            }
        });
        const onComplete = jest.fn((payload: CompletePayload) => {
            if ('message' in payload) {
                completeSpy(payload.message);
                return payload.message.length;
            }
            return 0;
        });

        typedPubSub.subscribe('addTodo', addTodoCallback);
        typedPubSub.subscribe('clearTodos', clearTodosCallback);
        typedPubSub.subscribe('notifyAsync', async message => {
            await Promise.resolve(message.toUpperCase());
        });
        typedPubSub.subscribe('status', onProgress);
        typedPubSub.subscribe('status', onComplete);

        typedPubSub.publish('addTodo', { id: 1, text: 'First todo' });
        typedPubSub.publish('clearTodos');
        await typedPubSub.publishAsync('status', { type: 'progress', value: 50 });
        await typedPubSub.publishAsync('status', { type: 'complete', message: 'done' });

        expect(addTodoCallback).toHaveBeenCalledWith({ id: 1, text: 'First todo' });
        expect(clearTodosCallback).toHaveBeenCalledTimes(1);
        expect(progressSpy).toHaveBeenCalledWith(50);
        expect(completeSpy).toHaveBeenCalledWith('done');

        // @ts-expect-error wrong payload type should not compile
        () => typedPubSub.publish('addTodo', 'invalid');
        // @ts-expect-error wrong payload shape for status
        () => typedPubSub.publish('status', { type: 'complete', value: 1 });
        // @ts-expect-error wrong callback signature
        const wrongStatusSubscribe = () => typedPubSub.subscribe('status', (payload: number) => payload);

        // @ts-expect-error unknown channel name
        () => typedPubSub.subscribe('unknownChannel', () => {});
    });
});
