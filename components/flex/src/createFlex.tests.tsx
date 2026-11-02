import React from 'react';
import { render, screen } from '@testing-library/react';
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from './createFlex';

describe('components/Flex/createFlex', () => {
    const View = createView({ unit: '8px', grid: { sm: 0.5, md: 1, lg: 1.5 } } as const);
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

    test('разводит разные rowGap и columnGap по классам', () => {
        render(<Flex rowGap="sm" columnGap="lg" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex--rg-sm', 'bsui-flex--cg-lg');
    });

    test('проксирует spacing-пропсы созданного View', () => {
        render(<Flex padding="md" data-testid="flex" />);

        expect(screen.getByTestId('flex')).toHaveClass('bsui-flex', 'bsui-p-md');
    });

    test('регистрирует модификаторы и gap в тот же style-элемент, что и стили View', () => {
        const freshView = createView({ unit: '4px', grid: { md: 1 } } as const);

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
});
