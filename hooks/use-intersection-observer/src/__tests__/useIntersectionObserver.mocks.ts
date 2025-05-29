import { act } from '@testing-library/react-hooks';

interface IObserverData {
    callback: IntersectionObserverCallback;
    elements: Set<Element>;
    created: number;
}

let isMocking = false;

const observersMap = new Map<IntersectionObserver, IObserverData>();

function warnOnMissingSetup() {
    if (isMocking) return;
    console.error('Intersection Observer was not configured to handle mocking');
}

export function setupIntersectionMocking(mockFn: typeof vi.fn): void {
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

    isMocking = true;
}

export function resetIntersectionMocking(): void {
    if (
        global.IntersectionObserver &&
        'mockClear' in global.IntersectionObserver &&
        typeof global.IntersectionObserver.mockClear === 'function'
    ) {
        global.IntersectionObserver.mockClear();
    }
    observersMap.clear();
}

function triggerIntersection(
    elements: Element[],
    trigger: boolean | number,
    observer: IntersectionObserver,
    observerData: IObserverData
): void {
    const entries: IntersectionObserverEntry[] = [];

    const isIntersecting =
        typeof trigger === 'number' ? observer.thresholds.some(threshold => trigger >= threshold) : trigger;

    let ratio: number;

    if (typeof trigger === 'number') {
        const intersectedThresholds = observer.thresholds.filter(threshold => trigger >= threshold);
        ratio = intersectedThresholds.length > 0 ? intersectedThresholds[intersectedThresholds.length - 1] : 0;
    } else {
        ratio = trigger ? 1 : 0;
    }

    for (const element of elements) {
        entries.push(<IntersectionObserverEntry>{
            boundingClientRect: element.getBoundingClientRect(),
            intersectionRatio: ratio,
            intersectionRect: isIntersecting
                ? element.getBoundingClientRect()
                : {
                      bottom: 0,
                      height: 0,
                      left: 0,
                      right: 0,
                      top: 0,
                      width: 0,
                      x: 0,
                      y: 0,
                      toJSON() {}
                  },
            isIntersecting,
            rootBounds: observer.root instanceof Element ? observer.root?.getBoundingClientRect() : null,
            target: element,
            time: Date.now() - observerData.created
        });
    }
    act(() => observerData.callback(entries, observer));
}

export function mockAllIsIntersecting(isIntersecting: boolean | number): void {
    warnOnMissingSetup();
    for (const [observer, observerData] of observersMap) {
        triggerIntersection(Array.from(observerData.elements), isIntersecting, observer, observerData);
    }
}

export function intersectionMockInstance(element: Element): IntersectionObserver {
    warnOnMissingSetup();
    for (const [observer, observerData] of observersMap) {
        if (observerData.elements.has(element)) {
            return observer;
        }
    }

    throw new Error('Failed to find IntersectionObserver for element. Is it being observed?');
}

export function mockIsIntersecting(element: Element, isIntersecting: boolean | number): void {
    warnOnMissingSetup();
    const observer = intersectionMockInstance(element);
    if (!observer) {
        throw new Error('No IntersectionObserver instance found for element. Is it still mounted in the DOM?');
    }
    const observerData = observersMap.get(observer);
    if (observerData) {
        triggerIntersection([element], isIntersecting, observer, observerData);
    }
}
