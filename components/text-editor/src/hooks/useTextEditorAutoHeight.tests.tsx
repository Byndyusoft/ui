import { CSSProperties } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import useTextEditorAutoHeight from './useTextEditorAutoHeight';

/* eslint-disable testing-library/no-node-access -- This hook measures and restores the supplied DOM node. */
describe('TextEditor auto height', () => {
    let element: HTMLDivElement;
    let contentHeight: number;
    let observerCallback: ResizeObserverCallback;
    let observer: ResizeObserver;
    let frame: FrameRequestCallback | undefined;
    let disconnect: ReturnType<typeof vi.fn>;
    let request: ReturnType<typeof vi.fn>;
    let cancel: ReturnType<typeof vi.fn>;
    beforeEach(() => {
        element = document.createElement('div');
        document.body.append(element);
        contentHeight = 80;
        Object.defineProperty(element, 'scrollHeight', { get: () => contentHeight });
        vi.spyOn(element, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
        disconnect = vi.fn();
        vi.stubGlobal(
            'ResizeObserver',
            class {
                constructor(callback: ResizeObserverCallback) {
                    observerCallback = callback;
                    observer = this as unknown as ResizeObserver;
                }
                observe = vi.fn();
                unobserve = vi.fn();
                disconnect = disconnect;
            }
        );
        request = vi.fn((callback: FrameRequestCallback) => {
            frame = callback;
            return 1;
        });
        cancel = vi.fn();
        vi.stubGlobal('requestAnimationFrame', request);
        vi.stubGlobal('cancelAnimationFrame', cancel);
    });
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        element.remove();
        frame = undefined;
    });
    it.each(['content-box', 'border-box'])('grows and shrinks with padding/border in %s', sizing => {
        element.style.cssText = `box-sizing:${sizing};padding:5px;border:2px solid;min-height:40px;max-height:100px`;
        const ref = { current: element };
        const { rerender } = renderHook(({ revision }) => useTextEditorAutoHeight(ref, true, undefined, revision), {
            initialProps: { revision: 0 }
        });
        expect(element.style.height).toBe(sizing === 'border-box' ? '84px' : '70px');
        contentHeight = 160;
        rerender({ revision: 1 });
        act(() => {
            frame?.(0);
        });
        expect(element.style.height).toBe('100px');
        expect(element.style.overflowY).toBe('auto');
        contentHeight = 20;
        rerender({ revision: 2 });
        act(() => {
            frame?.(0);
        });
        expect(element.style.height).toBe('40px');
        expect(element.style.overflowY).toBe('hidden');
    });
    it('coalesces width changes, ignores height-only notifications and cleans subscriptions', () => {
        const ref = { current: element };
        const { unmount } = renderHook(() => useTextEditorAutoHeight(ref, true, undefined, 0));
        const notify = (width: number): void =>
            observerCallback(
                [{ target: element, contentRect: { width } }] as unknown as ResizeObserverEntry[],
                observer
            );
        act(() => {
            notify(200);
            notify(200);
        });
        expect(request).toHaveBeenCalledOnce();
        act(() => {
            frame?.(0);
        });
        request.mockClear();
        act(() => {
            notify(200);
        });
        expect(request).not.toHaveBeenCalled();
        act(() => {
            notify(100);
        });
        unmount();
        expect(disconnect).toHaveBeenCalledOnce();
        expect(cancel).toHaveBeenCalledWith(1);
    });
    it('handles resize without ResizeObserver and restores current user styles on disable', () => {
        vi.stubGlobal('ResizeObserver', undefined);
        const ref = { current: element };
        const initialProps: { enabled: boolean; style: CSSProperties } = {
            enabled: true,
            style: { height: 55, overflowY: 'scroll', resize: 'both' }
        };
        const { rerender, unmount } = renderHook(
            ({ enabled, style }) => useTextEditorAutoHeight(ref, enabled, style, 0),
            { initialProps }
        );
        act(() => {
            window.dispatchEvent(new Event('resize'));
        });
        expect(request).toHaveBeenCalledOnce();
        rerender({ enabled: false, style: { height: 70, overflowY: 'visible', resize: 'vertical' } });
        expect(element.style.height).toBe('70px');
        expect(element.style.resize).toBe('vertical');
        expect(element.style.overflowY).toBe('visible');
        request.mockClear();
        act(() => {
            window.dispatchEvent(new Event('resize'));
        });
        expect(request).not.toHaveBeenCalled();
        unmount();
    });
    it('skips hidden measurements and measures after showing again', () => {
        const ref = { current: element };
        vi.spyOn(element, 'getClientRects').mockReturnValue([] as unknown as DOMRectList);
        const { rerender } = renderHook(({ revision }) => useTextEditorAutoHeight(ref, true, undefined, revision), {
            initialProps: { revision: 0 }
        });
        expect(element.style.height).toBe('');
        vi.spyOn(element, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
        rerender({ revision: 1 });
        act(() => {
            frame?.(0);
        });
        expect(element.style.height).toBe('80px');
    });
});
