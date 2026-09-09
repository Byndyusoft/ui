import React from 'react';
import { TPluralLocale, TPluralProps } from './Plural.types';
import { getPluralForm } from './Plural.utilities';

const Plural = (props: TPluralProps<TPluralLocale>): JSX.Element => {
    if (props.locale) {
        return React.createElement(
            React.Fragment,
            null,
            getPluralForm(...([props.count, props.forms, props.locale] as Parameters<typeof getPluralForm>))
        );
    }

    return React.createElement(React.Fragment, null, getPluralForm(props.count, props.forms));
};

export default Plural;
