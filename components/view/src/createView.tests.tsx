import React from 'react';
import { render, screen } from '@testing-library/react';
import { createView } from './createView';
import { resetLayoutStyles } from './layoutStylesRegistry';

describe('components/View/createView', () => {
    const config = { unit: '8px', grid: { sm: 0.5, md: 1, lg: 1.5 } } as const;
    const View = createView(config);

    afterEach(() => {
        resetLayoutStyles();
        // eslint-disable-next-line testing-library/no-node-access -- очистка инъецированных style-элементов head
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());
    });

    test('маппит spacing-пропсы в сгенерированные классы без inline-стилей', () => {
        render(
            <View padding="lg" marginBottom="sm" marginHorizontal="md" data-testid="view">
                content
            </View>
        );
        const element = screen.getByTestId('view');

        expect(element).toHaveClass('bsui-mb-sm bsui-mh-md bsui-p-lg', { exact: true });
        expect(element).not.toHaveAttribute('style');
    });

    test('не прокидывает spacing-пропсы в DOM и сохраняет нативные атрибуты', () => {
        render(<View padding="md" id="root" data-testid="view" aria-label="block" />);
        const element = screen.getByTestId('view');

        expect(element).not.toHaveAttribute('padding');
        expect(element).toHaveAttribute('id', 'root');
        expect(element).toHaveAttribute('aria-label', 'block');
    });

    test('рендерит тег из пропса as и мержит className', () => {
        render(<View as="section" padding="md" className="custom" data-testid="view" />);
        const element = screen.getByTestId('view');

        expect(element.tagName).toBe('SECTION');
        expect(element).toHaveClass('bsui-p-md custom', { exact: true });
    });

    test('не выставляет пустой className', () => {
        render(<View data-testid="view" />);

        expect(screen.getByTestId('view')).not.toHaveAttribute('class');
    });

    test('инъецирует сгенерированный CSS в документ при создании', () => {
        createView(config);

        // eslint-disable-next-line testing-library/no-node-access -- тест проверяет инъекцию style-элемента в head
        expect(document.head.querySelector('style[id^="bsui-layout-"]')?.textContent).toContain(
            '.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}'
        );
    });

    test('бросает ошибку на недопустимом токене сетки', () => {
        expect(() => createView({ unit: '8px', grid: { 'my token': 1 } })).toThrow(
            'недопустимый токен сетки "my token"'
        );
    });

    test('несёт конфигурацию на компоненте для createFlex', () => {
        expect(View.config).toEqual(config);
    });
});
