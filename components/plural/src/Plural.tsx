import React from 'react';
import { IPluralProps, TPluralForms, TPluralLocale } from './Plural.types';
import { defaultPluralLocale, getPluralForm } from './Plural.utilities';

const Plural = <TLocale extends TPluralLocale = typeof defaultPluralLocale>({
    count,
    forms,
    locale
}: IPluralProps<TLocale>): JSX.Element => {
    if (locale) {
        return React.createElement(React.Fragment, null, getPluralForm(count, forms, locale));
    }

    return React.createElement(
        React.Fragment,
        null,
        getPluralForm(count, forms as TPluralForms<typeof defaultPluralLocale>)
    );
};

export default Plural;
