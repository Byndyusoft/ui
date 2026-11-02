// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createView } from './createView';
import { LayoutStyles } from './LayoutStyles';

describe('components/View/LayoutStyles (SSR)', () => {
    test('серверный рендер включает сгенерированный CSS в HTML', () => {
        createView({ unit: '8px', grid: { md: 1 } } as const);

        // eslint-disable-next-line testing-library/render-result-naming-convention -- это renderToString из react-dom/server, не testing-library
        const markup = renderToString(<LayoutStyles />);

        expect(markup).toContain('<style');
        expect(markup).toContain('bsui-layout-');
        expect(markup).toContain('.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}');
    });
});
