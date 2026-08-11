import { ReactNode } from 'react';

export interface IPluralCategoriesByLocale {
    ru: 'one' | 'few' | 'many' | 'other';
    en: 'one' | 'other';
}

export type TPluralLocale = keyof IPluralCategoriesByLocale;

export type TPluralForms<TLocale extends TPluralLocale = TPluralLocale> = TLocale extends TPluralLocale
    ? Record<IPluralCategoriesByLocale[TLocale], ReactNode>
    : never;

export interface IPluralProps<TLocale extends TPluralLocale = 'ru'> {
    count: number;
    forms: TPluralForms<TLocale>;
    locale?: TLocale;
}
