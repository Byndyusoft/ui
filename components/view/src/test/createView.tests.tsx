import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createView } from '../createView';
import { spacingPropPrefixes } from '../constants';
import { resetStyles } from '../utilities';

describe('components/View/createView', () => {
    const config = { unit: '8px', values: { sm: 0.5, md: 1, lg: 1.5 } } as const;
    const View = createView(config);

    afterEach(() => {
        resetStyles();
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
        expect(Array.from(element.classList)).toEqual(['bsui-p-md', 'custom']);
    });

    test('не выставляет пустой className', () => {
        render(<View data-testid="view" />);

        expect(screen.getByTestId('view')).not.toHaveAttribute('class');
    });

    test('повторно использует замороженные props и передаёт нативные атрибуты и события', () => {
        const onClick = vi.fn();
        const props = Object.freeze({
            as: 'section',
            padding: 'md',
            marginBottom: 'sm',
            id: 'layout',
            'aria-label': 'layout',
            'data-testid': 'view',
            style: Object.freeze({ color: 'red' }),
            onClick,
            children: 'content'
        } as const);
        const { rerender } = render(<View {...props} />);

        fireEvent.click(screen.getByTestId('view'));
        rerender(<View {...props} className="custom" />);

        const element = screen.getByTestId('view');

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(props.padding).toBe('md');
        expect(props.marginBottom).toBe('sm');
        expect(props.style).toEqual({ color: 'red' });
        expect(element.tagName).toBe('SECTION');
        expect(element).toHaveAttribute('id', 'layout');
        expect(element).toHaveAttribute('aria-label', 'layout');
        expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
        expect(element).toHaveTextContent('content');
        expect(Array.from(element.classList)).toEqual(['bsui-mb-sm', 'bsui-p-md', 'custom']);

        Object.keys(spacingPropPrefixes).forEach(name => {
            expect(element).not.toHaveAttribute(name);
        });
    });

    test('инъецирует сгенерированный CSS в документ при создании', () => {
        createView(config);

        // eslint-disable-next-line testing-library/no-node-access -- тест проверяет инъекцию style-элемента в head
        expect(document.head.querySelector('style[id^="bsui-layout-"]')?.textContent).toContain(
            '.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}'
        );
    });

    test('бросает ошибку на недопустимом токене сетки', () => {
        expect(() => createView({ unit: '8px', values: { 'my token': 1 } })).toThrow(
            'недопустимый токен сетки "my token"'
        );
    });

    test('несёт конфигурацию на компоненте для createFlex', () => {
        expect(View.config).toEqual(config);
    });

    test('использует публичное имя View', () => {
        expect(View.displayName).toBe('View');
    });
});
