// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import useResizeObserver from './useResizeObserver';

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

test('useResizeObserver рендерится на сервере без DOM и предупреждений о layout-эффектах', () => {
    const callback = vi.fn();
    const createObserver = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const readElement = vi.fn((): null => {
        throw new Error('Чтение ref.current во время серверного рендера');
    });
    const ref = {
        get current(): null {
            return readElement();
        }
    };
    const ServerComponent = (): JSX.Element => {
        useResizeObserver([ref], callback);

        return <div>Серверный рендер</div>;
    };
    vi.stubGlobal('ResizeObserver', createObserver);

    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    expect(renderToString(<ServerComponent />)).toContain('Серверный рендер');
    expect(createObserver).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(readElement).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
});
