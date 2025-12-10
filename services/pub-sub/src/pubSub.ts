type PubSubEventHandler = (...args: any[]) => unknown;
type PubSubEvents = Record<string, PubSubEventHandler>;

type EventArgs<Events extends PubSubEvents, EventName extends keyof Events> = Parameters<Events[EventName]>;
type EventReturn<Events extends PubSubEvents, EventName extends keyof Events> = ReturnType<Events[EventName]>;

export default class PubSub<Events extends PubSubEvents = PubSubEvents> {
    private events: Map<keyof Events, Set<Events[keyof Events]>> = new Map();

    subscribe<EventName extends keyof Events>(event: EventName, callback: Events[EventName]): void {
        const callbacks = (this.events.get(event) as Set<Events[EventName]> | undefined) ?? new Set<Events[EventName]>();
        callbacks.add(callback);
        this.events.set(event, callbacks);
    }

    subscribeOnce<EventName extends keyof Events>(event: EventName, callback: Events[EventName]): void {
        const onceCallback: Events[EventName] = ((...args: EventArgs<Events, EventName>) => {
            (callback as (...args: EventArgs<Events, EventName>) => void | Promise<void>)(...args);
            this.unsubscribe(event, onceCallback);
        }) as Events[EventName];

        this.subscribe(event, onceCallback);
    }

    publish<EventName extends keyof Events>(event: EventName, ...args: EventArgs<Events, EventName>): void {
        const callbacks = this.events.get(event) as Set<Events[EventName]> | undefined;
        callbacks?.forEach(callback => {
            (callback as (...args: EventArgs<Events, EventName>) => EventReturn<Events, EventName>)(...args);
        });
    }

    async publishAsync<EventName extends keyof Events>(
        event: EventName,
        ...args: EventArgs<Events, EventName>
    ): Promise<void> {
        const callbacks = this.events.get(event) as Set<Events[EventName]> | undefined;
        if (callbacks) {
            const handlers = Array.from(callbacks).map(callback =>
                Promise.resolve(
                    (callback as (...args: EventArgs<Events, EventName>) => EventReturn<Events, EventName>)(...args)
                )
            );
            await Promise.all(handlers);
        }
    }

    unsubscribe<EventName extends keyof Events>(event: EventName, callback: Events[EventName]): void {
        const callbacks = this.events.get(event) as Set<Events[EventName]> | undefined;
        if (!callbacks) {
            return;
        }

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            this.events.delete(event);
        }
    }

    unsubscribeAll(event?: keyof Events): void {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    reset(): void {
        this.events.clear();
    }

    getAllSubscribers(): { event: keyof Events; subscribers: Events[keyof Events][] }[] {
        return Array.from(this.events.entries()).map(([event, callbacks]) => ({
            event,
            subscribers: Array.from(callbacks) as Events[keyof Events][]
        }));
    }
}
