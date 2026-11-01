// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import useThrottledValue from './useThrottledValue';

test('при серверном рендере возвращает начальное состояние без таймеров', () => {
    vi.useFakeTimers();

    try {
        const Example = (): JSX.Element => {
            const [value] = useThrottledValue(() => 'серверное значение', 100);

            return <span>{value}</span>;
        };

        expect(renderToString(<Example />)).toContain('серверное значение');
        expect(vi.getTimerCount()).toBe(0);
    } finally {
        vi.useRealTimers();
    }
});
