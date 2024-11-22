interface IObserverData {
    callback: IntersectionObserverCallback;
    elements: Set<Element>;
    created: number;
}

const observersMap = new Map<IntersectionObserver, IObserverData>();

export function setupIntersectionMocking(mockFn: typeof jest.fn) {
    global.IntersectionObserver = mockFn((cb, options = {}) => {
        const observerData: IObserverData = {
            callback: cb,
            elements: new Set<Element>(),
            created: Date.now()
        };
        const instance: IntersectionObserver = {
            thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
            root: options.root ?? null,
            rootMargin: options.rootMargin ?? '',
            observe: mockFn((element: Element) => {
                observerData.elements.add(element);
            }),
            unobserve: mockFn((element: Element) => {
                observerData.elements.delete(element);
            }),
            disconnect: mockFn(() => {
                observersMap.delete(instance);
            }),
            takeRecords: mockFn()
        };

        observersMap.set(instance, observerData);

        return instance;
    });
}

export function resetIntersectionMocking() {
    if (
        global.IntersectionObserver &&
        'mockClear' in global.IntersectionObserver &&
        typeof global.IntersectionObserver.mockClear === 'function'
    ) {
        global.IntersectionObserver.mockClear();
    }
    observersMap.clear();
}
