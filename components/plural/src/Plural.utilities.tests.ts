import { getPluralCategories, getPluralForm } from './Plural.utilities';

const ruForms = {
    one: 'проект',
    few: 'проекта',
    many: 'проектов',
    other: 'проекта'
};

const enForms = {
    one: 'project',
    other: 'projects'
};

describe('components/Plural/utilities', () => {
    describe('getPluralCategories', () => {
        test('возвращает категории форм для локали', () => {
            expect(getPluralCategories('ru')).toEqual(['few', 'many', 'one', 'other']);
            expect(getPluralCategories('en')).toEqual(['one', 'other']);
        });
    });

    describe('getPluralForm', () => {
        describe('ru', () => {
            test.each([
                [1, 'проект'],
                [2, 'проекта'],
                [3, 'проекта'],
                [4, 'проекта'],
                [5, 'проектов'],
                [0, 'проектов'],
                [11, 'проектов'],
                [14, 'проектов'],
                [21, 'проект'],
                [22, 'проекта'],
                [101, 'проект'],
                [111, 'проектов'],
                [1.5, 'проекта'],
                [-1, 'проект']
            ] as Array<[number, string]>)('для %s возвращает "%s"', (count, expectedText) => {
                expect(getPluralForm(count, ruForms, 'ru')).toBe(expectedText);
            });
        });

        describe('en', () => {
            test.each([
                [1, 'project'],
                [-1, 'project'],
                [0, 'projects'],
                [2, 'projects'],
                [11, 'projects'],
                [21, 'projects']
            ] as Array<[number, string]>)('для %s возвращает "%s"', (count, expectedText) => {
                expect(getPluralForm(count, enForms, 'en')).toBe(expectedText);
            });
        });

        test('использует other как runtime fallback', () => {
            expect(getPluralForm(2, { other: 'items' } as never, 'ru')).toBe('items');
        });
    });
});
