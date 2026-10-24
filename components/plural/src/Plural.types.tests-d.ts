import React from 'react';
import { describe, test } from 'vitest';
import Plural from './Plural';
import { getPluralForm } from './Plural.utilities';

declare const locale: 'ru' | 'en';

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

// Файл проверяет не runtime-поведение, а типовую связь locale и forms.
describe('components/Plural/types', () => {
    test('требует соответствия forms динамической locale', () => {
        React.createElement(Plural, {
            count: 2,
            // @ts-expect-error: forms must be correlated with the concrete locale branch
            locale,
            forms: enForms
        });
    });

    test('требует соответствия аргументов утилиты динамической locale', () => {
        // @ts-expect-error: forms must be correlated with the concrete locale branch
        getPluralForm(2, enForms, locale);
    });

    test('разрешает forms для заданных locale', () => {
        React.createElement(Plural, {
            count: 2,
            locale: 'en',
            forms: enForms
        });

        React.createElement(Plural, {
            count: 2,
            locale: 'ru',
            forms: ruForms
        });

        getPluralForm(2, enForms, 'en');

        getPluralForm(2, ruForms, 'ru');
    });
});
