import { ReactNode } from 'react';
import { defaultPluralLocale } from './Plural.constants';

export interface IPluralCategoriesByLocale {
    ru: 'one' | 'few' | 'many' | 'other';
    en: 'one' | 'other';
}

export type TPluralLocale = keyof IPluralCategoriesByLocale;
type TDefaultPluralLocale = typeof defaultPluralLocale;

export type TPluralForms<TLocale extends TPluralLocale = TPluralLocale> = TLocale extends TPluralLocale
    ? Record<IPluralCategoriesByLocale[TLocale], ReactNode>
    : never;

type TPluralPropsByLocale<TLocale extends TPluralLocale = TPluralLocale> = TLocale extends TPluralLocale
    ? {
          count: number;
          forms: TPluralForms<TLocale>;
          locale: TLocale;
      }
    : never;

interface IDefaultPluralProps {
    count: number;
    forms: TPluralForms<TDefaultPluralLocale>;
    locale?: undefined;
}

export type TPluralProps<TLocale extends TPluralLocale = TDefaultPluralLocale> = TLocale extends TDefaultPluralLocale
    ? IDefaultPluralProps | TPluralPropsByLocale<TLocale>
    : TPluralPropsByLocale<TLocale>;
