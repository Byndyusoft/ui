import { ReactNode } from 'react';
import { TPluralForms, TPluralLocale } from './Plural.types';

export const defaultPluralLocale = 'ru' as const;

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

export function getPluralForm(count: number, forms: TPluralForms<'ru'>): ReactNode;
export function getPluralForm<TLocale extends TPluralLocale>(
    count: number,
    forms: TPluralForms<TLocale>,
    locale: TLocale
): ReactNode;
export function getPluralForm(
    count: number,
    forms: TPluralForms,
    locale: TPluralLocale = defaultPluralLocale
): ReactNode {
    const pluralCategory = getPluralRules(locale).select(count);
    const pluralForms = forms as Partial<Record<Intl.LDMLPluralRule, ReactNode>> & { other: ReactNode };

    return pluralForms[pluralCategory] ?? pluralForms.other;
}
