// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import useDebouncedValue from './useDebouncedValue';

test('при серверном рендере возвращает исходное значение без таймеров', () => {
    vi.useFakeTimers();

    try {
        const Example = (): JSX.Element => {
            const [value] = useDebouncedValue(() => 'серверное значение', 100);

            return <span>{value}</span>;
        };

        expect(renderToString(<Example />)).toContain('серверное значение');
        expect(vi.getTimerCount()).toBe(0);
    } finally {
        vi.useRealTimers();
    }
});
