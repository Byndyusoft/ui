import { act, renderHook } from '@testing-library/react-hooks';
import useIsContentScrolled from './useIsContentScrolled';

const createScrollElement = (): HTMLDivElement => {
    const element = document.createElement('div');

    Object.defineProperty(element, 'scrollLeft', {
        configurable: true,
        value: 0,
        writable: true
    });

    Object.defineProperty(element, 'scrollTop', {
        configurable: true,
        value: 0,
        writable: true
    });

    return element;
};

const setElementScrollPosition = (element: HTMLElement, scrollLeft: number, scrollTop: number): void => {
    element.scrollLeft = scrollLeft;
    element.scrollTop = scrollTop;
};

const setWindowScrollPosition = (scrollX: number, scrollY: number): void => {
    Object.defineProperty(window, 'scrollX', {
        configurable: true,
        value: scrollX
    });

    Object.defineProperty(window, 'scrollY', {
        configurable: true,
        value: scrollY
    });

    Object.defineProperty(window, 'pageXOffset', {
        configurable: true,
        value: scrollX
    });

    Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: scrollY
    });
};

describe('hooks/useIsContentScrolled', () => {
    beforeEach(() => {
        setWindowScrollPosition(0, 0);
    });

    test('returns initial state without scroll', () => {
        const element = createScrollElement();
        const ref = { current: element };

        const { result } = renderHook(() => useIsContentScrolled(ref));

        expect(result.current).toEqual({
            isScrolledByX: false,
            isScrolledByY: false
        });
    });

    test('returns initial state with negative x scroll', () => {
        const element = createScrollElement();
        setElementScrollPosition(element, -10, 0);
        const ref = { current: element };

        const { result } = renderHook(() => useIsContentScrolled(ref));

        expect(result.current).toEqual({
            isScrolledByX: true,
            isScrolledByY: false
        });
    });

    test('does not use window scroll position when target ref is not ready', () => {
        setWindowScrollPosition(15, 20);

        const ref = { current: null };

        const { result } = renderHook(() => useIsContentScrolled(ref));

        expect(result.current).toEqual({
            isScrolledByX: false,
            isScrolledByY: false
        });
    });

    test('detects element scroll by x axis', () => {
        const element = createScrollElement();
        const ref = { current: element };
        const { result } = renderHook(() => useIsContentScrolled(ref));

        act(() => {
            setElementScrollPosition(element, 10, 0);
            element.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toEqual({
            isScrolledByX: true,
            isScrolledByY: false
        });
    });

    test('detects element scroll by negative x axis', () => {
        const element = createScrollElement();
        const ref = { current: element };
        const { result } = renderHook(() => useIsContentScrolled(ref));

        act(() => {
            setElementScrollPosition(element, -10, 0);
            element.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toEqual({
            isScrolledByX: true,
            isScrolledByY: false
        });
    });

    test('detects element scroll by y axis', () => {
        const element = createScrollElement();
        const ref = { current: element };
        const { result } = renderHook(() => useIsContentScrolled(ref));

        act(() => {
            setElementScrollPosition(element, 0, 10);
            element.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toEqual({
            isScrolledByX: false,
            isScrolledByY: true
        });
    });

    test('uses window when target is not provided', () => {
        const { result } = renderHook(() => useIsContentScrolled());

        act(() => {
            setWindowScrollPosition(15, 20);
            window.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toEqual({
            isScrolledByX: true,
            isScrolledByY: true
        });
    });

    test('updates state only when scrolled state changes', () => {
        const element = createScrollElement();
        const ref = { current: element };
        const { result } = renderHook(() => useIsContentScrolled(ref));

        act(() => {
            setElementScrollPosition(element, 0, 10);
            element.dispatchEvent(new Event('scroll'));
        });

        const scrolledState = result.current;

        act(() => {
            setElementScrollPosition(element, 0, 20);
            element.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toBe(scrolledState);

        act(() => {
            setElementScrollPosition(element, 0, 0);
            element.dispatchEvent(new Event('scroll'));
        });

        expect(result.current).toEqual({
            isScrolledByX: false,
            isScrolledByY: false
        });
    });
});
