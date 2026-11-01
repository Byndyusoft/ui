import { MockInstance } from 'vitest';

interface ILayout {
    contentHeight: number;
    visible: boolean;
}

interface IObserverMock {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    notify: (target: Element, width: number, height?: number) => void;
}

export interface ITextAreaEnvironment {
    layout: ILayout;
    observers: Array<IObserverMock>;
    requestFrame: MockInstance<(callback: FrameRequestCallback) => number>;
    cancelFrame: MockInstance<(id: number) => void>;
    flushFrames: () => void;
}

// В jsdom нет расчёта размеров: отдельно моделируем нативные rows и ограничения CSS.
export function setupTextAreaEnvironment(): ITextAreaEnvironment {
    const layout: ILayout = { contentHeight: 20, visible: true };
    const getComputedStyle = window.getComputedStyle.bind(window);
    const observers: Array<IObserverMock> = [];
    const frames = new Map<number, FrameRequestCallback>();
    let frameId = 0;

    const resolvedStyle = (element: HTMLTextAreaElement): CSSStyleDeclaration => {
        const computed = getComputedStyle(element);
        const padding =
            Number.parseFloat(computed.paddingTop || '0') + Number.parseFloat(computed.paddingBottom || '0');
        const border =
            Number.parseFloat(computed.borderTopWidth || '0') + Number.parseFloat(computed.borderBottomWidth || '0');
        const borderBox = computed.boxSizing === 'border-box';
        const rowsHeight = element.rows * (Number.parseFloat(computed.lineHeight) || 20);
        const nativeHeight = rowsHeight + (borderBox ? padding + border : 0);
        const desiredHeight = Number.parseFloat(element.style.height) || nativeHeight;
        const minimum = Number.parseFloat(computed.minHeight) || 0;
        const maximum = Number.parseFloat(computed.maxHeight) || Infinity;

        computed.height = `${Math.max(minimum, Math.min(maximum, desiredHeight))}px`;

        return computed;
    };

    vi.spyOn(window, 'getComputedStyle').mockImplementation(element =>
        element instanceof HTMLTextAreaElement ? resolvedStyle(element) : getComputedStyle(element)
    );

    const getClientHeight = (element: HTMLTextAreaElement): number => {
        const computed = resolvedStyle(element);
        const padding =
            Number.parseFloat(computed.paddingTop || '0') + Number.parseFloat(computed.paddingBottom || '0');
        const border =
            Number.parseFloat(computed.borderTopWidth || '0') + Number.parseFloat(computed.borderBottomWidth || '0');

        return Number.parseFloat(computed.height) + (computed.boxSizing === 'border-box' ? -border : padding);
    };

    vi.spyOn(HTMLTextAreaElement.prototype, 'getClientRects').mockImplementation(
        () => (layout.visible ? [new DOMRect(0, 0, 200, 40)] : []) as unknown as DOMRectList
    );
    vi.spyOn(HTMLTextAreaElement.prototype, 'clientHeight', 'get').mockImplementation(function clientHeight(
        this: HTMLTextAreaElement
    ) {
        // eslint-disable-next-line no-invalid-this
        return getClientHeight(this);
    });
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(function scrollHeight(
        this: HTMLTextAreaElement
    ) {
        // eslint-disable-next-line no-invalid-this
        const computed = getComputedStyle(this);
        const padding =
            Number.parseFloat(computed.paddingTop || '0') + Number.parseFloat(computed.paddingBottom || '0');

        // eslint-disable-next-line no-invalid-this
        return Math.max(layout.contentHeight + padding, getClientHeight(this));
    });

    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        frameId += 1;
        frames.set(frameId, callback);

        return frameId;
    });
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
        frames.delete(id);
    });

    vi.stubGlobal(
        'ResizeObserver',
        vi.fn((callback: ResizeObserverCallback) => {
            const observe = vi.fn();
            const unobserve = vi.fn();
            const disconnect = vi.fn();
            const observer: ResizeObserver = { observe, unobserve, disconnect };

            observers.push({
                observe,
                unobserve,
                disconnect,
                notify: (target, width, height = 40) =>
                    callback(
                        [
                            {
                                target,
                                contentRect: new DOMRectReadOnly(0, 0, width, height),
                                borderBoxSize: [],
                                contentBoxSize: [],
                                devicePixelContentBoxSize: []
                            }
                        ],
                        observer
                    )
            });

            return observer;
        })
    );

    return {
        layout,
        observers,
        requestFrame,
        cancelFrame,
        flushFrames() {
            const pending = [...frames.values()];
            frames.clear();
            pending.forEach(callback => callback(0));
        }
    };
}

export function createTextArea(): HTMLTextAreaElement {
    const element = document.createElement('textarea');
    element.style.cssText = 'padding: 0; border: 0; box-sizing: content-box; line-height: 20px';
    document.body.append(element);

    return element;
}
