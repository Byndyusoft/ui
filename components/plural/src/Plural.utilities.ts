import { ReactNode } from 'react';
import { TPluralForms, TPluralLocale } from './Plural.types';
import { defaultPluralLocale } from './Plural.constants';

const pluralRulesByLocale = new Map<TPluralLocale, Intl.PluralRules>();

function getPluralRules(locale: TPluralLocale = defaultPluralLocale): Intl.PluralRules {
    let pluralRules = pluralRulesByLocale.get(locale);

    if (!pluralRules) {
        pluralRules = new Intl.PluralRules(locale);
        pluralRulesByLocale.set(locale, pluralRules);
    }

    return pluralRules;
}

export function getPluralCategories(locale: TPluralLocale = defaultPluralLocale): Array<Intl.LDMLPluralRule> {
    return getPluralRules(locale).resolvedOptions().pluralCategories;
}

type TGetPluralFormArgs =
    | [count: number, forms: TPluralForms<typeof defaultPluralLocale>]
    | {
          [TLocale in TPluralLocale]: [count: number, forms: TPluralForms<TLocale>, locale: TLocale];
      }[TPluralLocale];

export function getPluralForm(...[count, forms, locale = defaultPluralLocale]: TGetPluralFormArgs): ReactNode {
    const pluralCategory = getPluralRules(locale).select(count);
    const pluralForms = forms as Partial<Record<Intl.LDMLPluralRule, ReactNode>> & { other: ReactNode };

    return Object.prototype.hasOwnProperty.call(pluralForms, pluralCategory)
        ? pluralForms[pluralCategory]
        : pluralForms.other;
}
