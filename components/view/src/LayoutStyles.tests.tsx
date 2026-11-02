/* eslint-disable testing-library/no-node-access, testing-library/no-container --
   компонент рендерит style-элемент, недоступный через user-facing queries */
import React from 'react';
import { render } from '@testing-library/react';
import { createView } from './createView';
import { LayoutStyles } from './LayoutStyles';
import { resetLayoutStyles } from './layoutStylesRegistry';

describe('components/View/LayoutStyles', () => {
    afterEach(() => {
        resetLayoutStyles();
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());
    });

    test('рендерит style-элементы со стабильным id и сгенерированным CSS', () => {
        createView({ unit: '8px', grid: { md: 1 } } as const);

        const { container } = render(<LayoutStyles />);
        const style = container.querySelector('style');

        expect(style?.id).toMatch(/^bsui-layout-/);
        expect(style?.textContent).toContain('.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}');
    });

    test('при наличии отрендеренного компонентом style инъектор не добавляет дубль', () => {
        resetLayoutStyles();
        createView({ unit: '8px', grid: { md: 1 } } as const);

        // эмулируем клиент после SSR: автоинъекции ещё не было, в head лежит серверный style
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());

        const { container, unmount } = render(<LayoutStyles />);
        const serverHtmlHolder = document.createElement('div');

        serverHtmlHolder.innerHTML = container.innerHTML;
        unmount();

        const serverStyle = serverHtmlHolder.firstChild as HTMLStyleElement;

        document.head.appendChild(serverStyle);

        resetLayoutStyles();
        createView({ unit: '8px', grid: { md: 1 } } as const);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
        expect(document.getElementById(serverStyle.id)).toBe(serverStyle);
    });
});
