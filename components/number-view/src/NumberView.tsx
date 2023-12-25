import React, { Fragment } from 'react';
import { INumberViewProps } from './NumberView.types';
import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';
import FootnoteView from './FootnoteView';
import styles from './NumberView.module.css';

export const THIN_INEXTRICABLE_SPACE_LABEL = 'Thin inextricable space symbol';

const NumberView = ({ number, footnote, className = '', formatterOptions = {} }: INumberViewProps): JSX.Element => {
    const formatter = new Intl.NumberFormat('ru', formatterOptions);

    const formattedNumberParts = formatter.format(number).split(/\s/);

    const buildNumberElement = (numberPart: string, numberPartIndex: number): JSX.Element => {
        const numberPartKey = `${number}_${numberPart}`;
        const isLastNumberPart = numberPartIndex === formattedNumberParts.length - 1;

        if (isLastNumberPart) {
            return <Fragment key={numberPartKey}>{numberPart}</Fragment>;
        }

        return (
            <Fragment key={numberPartKey}>
                {numberPart}
                <span className={styles.thinInextricableSpace} aria-label={THIN_INEXTRICABLE_SPACE_LABEL} />
            </Fragment>
        );
    };

    const numberElement = <span className={className}>{formattedNumberParts.map(buildNumberElement)}</span>;

    return <span>{footnote ? <FootnoteView {...footnote}>{numberElement}</FootnoteView> : numberElement}</span>;
};

NumberView.footnoteTypes = footnoteTypes;
NumberView.footnoteValueSizeMods = footnoteValueSizeMods;

export default NumberView;
