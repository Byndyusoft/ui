import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from '../createFlex';

describe('components/Flex/createFlex', () => {
    const View = createView({ unit: '8px', values: { sm: 0.5, md: 1, lg: 1.5 } } as const);
    const Flex = createFlex(View);

    afterEach(() => {
        // eslint-disable-next-line testing-library/no-node-access -- очистка инъецированных style-элементов head
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());
    });

    test('рендерится через созданный View с базовым классом', () => {
        render(<Flex data-testid="flex" />);
        const element = screen.getByTestId('flex');

        expect(element).toHaveClass('bsui-flex', { exact: true });
    });

    test('применяет модификаторы раскладки', () => {
        render(
            <Flex
                direction="column"
                wrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                data-testid="flex"
            />
        );

        expect(screen.getByTestId('flex')).toHaveClass(
            'bsui-flex bsui-flex--fd-column bsui-flex--fw-wrap bsui-flex--ai-center bsui-flex--jc-space-between',
            { exact: true }
        );
    });

    test('маппит gap в классы токенов', () => {
        render(<Flex gap="md" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex--g-md');
    });

    test('объединяет одинаковые rowGap и columnGap в общий класс', () => {
        render(<Flex rowGap="lg" columnGap="lg" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex--g-lg');
    });

    test('gap имеет приоритет над rowGap и columnGap', () => {
        render(<Flex gap="md" rowGap="sm" columnGap="lg" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex bsui-flex--g-md', { exact: true });
    });

    test('разводит разные rowGap и columnGap по классам', () => {
        render(<Flex rowGap="sm" columnGap="lg" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex--rg-sm', 'bsui-flex--cg-lg');
    });

    test('проксирует spacing-пропсы созданного View', () => {
        render(<Flex padding="md" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex', 'bsui-p-md');
    });

    test('проксирует короткие spacing aliases и не передаёт их в DOM', () => {
        render(<Flex m="md" p="lg" data-testid="flex" />);
        const element = screen.getByTestId('flex');

        expect(element).toHaveClass('bsui-flex bsui-m-md bsui-p-lg', { exact: true });
        expect(element).not.toHaveAttribute('m');
        expect(element).not.toHaveAttribute('p');
    });

    test('сохраняет порядок spacing, пользовательских классов, модификаторов и gap', () => {
        render(<Flex padding="md" className="custom" direction="column" gap="sm" data-testid="flex" />);

        expect(Array.from(screen.getByTestId('flex').classList)).toEqual([
            'bsui-p-md',
            'bsui-flex',
            'custom',
            'bsui-flex--fd-column',
            'bsui-flex--g-sm'
        ]);
        expect(screen.getByTestId('flex')).toHaveClass(
            'bsui-p-md bsui-flex custom bsui-flex--fd-column bsui-flex--g-sm',
            { exact: true }
        );
    });

    test('повторно использует замороженные props и передаёт нативные атрибуты и события', () => {
        const onClick = vi.fn();
        const props = Object.freeze({
            as: 'section',
            direction: 'column',
            wrap: 'wrap',
            alignContent: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'sm',
            padding: 'md',
            id: 'layout',
            'aria-label': 'layout',
            'data-testid': 'flex',
            style: Object.freeze({ color: 'red' }),
            onClick,
            children: 'content'
        } as const);
        const { rerender } = render(<Flex {...props} />);

        fireEvent.click(screen.getByTestId('flex'));
        rerender(<Flex {...props} className="custom" />);

        const element = screen.getByTestId('flex');

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(props.direction).toBe('column');
        expect(props.gap).toBe('sm');
        expect(props.padding).toBe('md');
        expect(props.style).toEqual({ color: 'red' });
        expect(element.tagName).toBe('SECTION');
        expect(element).toHaveAttribute('id', 'layout');
        expect(element).toHaveAttribute('aria-label', 'layout');
        expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
        expect(element).toHaveTextContent('content');
        expect(element).toHaveClass('bsui-p-md bsui-flex custom bsui-flex--g-sm');

        ['direction', 'wrap', 'alignContent', 'alignItems', 'justifyContent', 'gap', 'padding'].forEach(name => {
            expect(element).not.toHaveAttribute(name);
        });
    });

    test('регистрирует модификаторы и gap в тот же style-элемент, что и стили View', () => {
        const freshView = createView({ unit: '4px', values: { md: 1 } } as const);

        createFlex(freshView);

        const marker = '.bsui-p-md{padding:calc(var(--bsui-unit, 4px) * 1)}';
        // eslint-disable-next-line testing-library/no-node-access -- тест проверяет инъекцию style-элемента в head
        const styles = Array.from(document.head.querySelectorAll('style[id^="bsui-layout-"]'));
        const stylesWithSpacing = styles.filter(style => style.textContent?.includes(marker));

        expect(stylesWithSpacing).toHaveLength(1);
        expect(stylesWithSpacing[0]).toHaveTextContent('.bsui-flex{display:flex}');
        expect(stylesWithSpacing[0]).toHaveTextContent('.bsui-flex--g-md{gap:calc(var(--bsui-unit, 4px) * 1)}');
    });

    test('несёт конфигурацию созданного View', () => {
        expect(Flex.config).toEqual(View.config);
    });

    test('использует публичное имя Flex', () => {
        expect(Flex.displayName).toBe('Flex');
    });
});
