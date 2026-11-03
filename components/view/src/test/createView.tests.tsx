import React, { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createView } from '../createView';
import { spacingPropPrefixes } from '../constants';
import { resetStyles } from '../utilities';

describe('components/View/createView', () => {
    const config = { step: { value: 8, unit: 'px' }, values: { sm: 0.5, md: 1, lg: 1.5 } } as const;
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

    test('маппит короткие aliases margin и padding в те же CSS-классы', () => {
        render(<View m="md" p="lg" data-testid="view" />);
        const element = screen.getByTestId('view');

        expect(element).toHaveClass('bsui-m-md bsui-p-lg', { exact: true });
        expect(element).not.toHaveAttribute('m');
        expect(element).not.toHaveAttribute('p');
    });

    test('передаёт object ref на DOM-элемент, выбранный через as', () => {
        const ref = createRef<HTMLElement>();

        render(<View as="section" ref={ref} data-testid="view" />);

        expect(ref.current).toBe(screen.getByTestId('view'));
        expect(ref.current?.tagName).toBe('SECTION');
    });

    test('callback ref получает DOM-элемент и очищается при размонтировании', () => {
        const receivedElements: Array<HTMLElement | null> = [];
        const ref = (element: HTMLElement | null): void => {
            receivedElements.push(element);
        };
        const { unmount } = render(<View as="article" ref={ref} data-testid="view" />);
        const element = screen.getByTestId('view');

        expect(receivedElements).toEqual([element]);

        unmount();

        expect(receivedElements).toEqual([element, null]);
    });

    test('применяет пользовательский prefix к spacing-классам', () => {
        const AppView = createView({ ...config, prefix: 'app' });

        render(<AppView m="md" paddingTop="sm" data-testid="view" />);

        expect(screen.getByTestId('view')).toHaveClass('app-m-md app-pt-sm', { exact: true });
    });

    test('разрешает полные и короткие aliases в порядке ключей итоговых props', () => {
        render(
            <>
                <View margin="sm" m="md" data-testid="short-last" />
                <View m="md" margin="lg" data-testid="long-last" />
                <View margin="lg" m={undefined} data-testid="undefined-last" />
            </>
        );

        expect(screen.getByTestId('short-last')).toHaveClass('bsui-m-md', { exact: true });
        expect(screen.getByTestId('long-last')).toHaveClass('bsui-m-lg', { exact: true });
        expect(screen.getByTestId('undefined-last')).toHaveClass('bsui-m-lg', { exact: true });
    });

    test('применяет приоритет общих, осевых и физических margin/padding props', () => {
        render(
            <>
                <View margin="sm" marginTop="md" marginHorizontal="lg" data-testid="margin" />
                <View marginHorizontal="md" marginLeft="sm" marginRight="lg" marginTop="sm" data-testid="horizontal" />
                <View marginVertical="md" marginTop="sm" marginBottom="lg" marginRight="sm" data-testid="vertical" />
                <View padding="lg" paddingVertical="sm" paddingTop="md" data-testid="padding" />
            </>
        );

        expect(screen.getByTestId('margin')).toHaveClass('bsui-m-sm', { exact: true });
        expect(screen.getByTestId('horizontal')).toHaveClass('bsui-mt-sm bsui-mh-md', { exact: true });
        expect(screen.getByTestId('vertical')).toHaveClass('bsui-mr-sm bsui-mv-md', { exact: true });
        expect(screen.getByTestId('padding')).toHaveClass('bsui-p-lg', { exact: true });
    });

    test('схлопывает одинаковые токены четырёх сторон в общий margin/padding класс', () => {
        render(
            <View
                marginTop="md"
                marginRight="md"
                marginBottom="md"
                marginLeft="md"
                paddingTop="sm"
                paddingRight="sm"
                paddingBottom="sm"
                paddingLeft="sm"
                data-testid="view"
            />
        );

        expect(screen.getByTestId('view')).toHaveClass('bsui-m-md bsui-p-sm', { exact: true });
    });

    test('схлопывает одинаковые пары сторон в horizontal/vertical классы', () => {
        render(<View marginTop="md" marginBottom="md" paddingLeft="sm" paddingRight="sm" data-testid="view" />);

        expect(screen.getByTestId('view')).toHaveClass('bsui-mv-md bsui-ph-sm', { exact: true });
    });

    test('оставляет одиночную сторону без shorthand-класса', () => {
        render(<View marginTop="md" paddingRight="sm" data-testid="view" />);

        expect(screen.getByTestId('view')).toHaveClass('bsui-mt-md bsui-pr-sm', { exact: true });
    });

    test('не схлопывает разные токены только из-за совпадения множителей', () => {
        const AliasValuesView = createView({
            step: { value: 8, unit: 'px' },
            values: { a: 1, b: 1, c: 1, d: 1 }
        } as const);

        render(<AliasValuesView marginTop="a" marginRight="b" marginBottom="c" marginLeft="d" data-testid="view" />);

        expect(screen.getByTestId('view')).toHaveClass('bsui-mt-a bsui-mr-b bsui-mb-c bsui-ml-d', { exact: true });
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
            '.bsui-p-md{padding:8px}'
        );
    });

    test('бросает ошибку на недопустимом токене сетки', () => {
        expect(() => createView({ step: { value: 8, unit: 'px' }, values: { 'my token': 1 } })).toThrow(
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
