type Callback = (data: unknown) => void;

export default class PubSub {
    private events: Map<string, Set<Callback>> = new Map();

    subscribe(event: string, callback: Callback): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);
    }

    subscribeOnce(event: string, callback: Callback): void {
        const onceCallback: Callback = (data: unknown) => {
            callback(data); // Execute the callback
            this.unsubscribe(event, onceCallback); // Unsubscribe after execution
        };
        this.subscribe(event, onceCallback);
    }

    publish(event: string, data: unknown = null): void {
        if (this.events.has(event)) {
            this.events.get(event)!.forEach(callback => callback(data));
        }
    }

    async publishAsync(event: string, data: unknown = null): Promise<void> {
        if (this.events.has(event)) {
            const callbacks = Array.from(this.events.get(event)!);
            // Execute all callbacks concurrently
            await Promise.all(callbacks.map(callback => callback(data)));
        }
    }

    unsubscribe(event: string, callback: Callback): void {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event)!;
            callbacks.delete(callback);

            // Clean up the event if no callbacks are left
            if (callbacks.size === 0) {
                this.events.delete(event);
            }
        }
    }

    unsubscribeAll(event?: string): void {
        if (event) {
            if (this.events.has(event)) {
                this.events.delete(event);
            }
        } else {
            this.events.clear();
        }
    }

    reset(): void {
        this.events.clear();
    }

    getAllSubscribers(): { event: string; subscribers: Callback[] }[] {
        return Array.from(this.events.entries()).map(([event, callbacks]) => {
            return { event, subscribers: Array.from(callbacks) };
        });
    }
}
