import React, { Fragment, useMemo } from 'react';
import cn from 'classnames';
import { IFormattedNumberViewProps } from './FormattedNumberView.types';
import getDefaultFormatter from './getDefaultFormatter';
import parseNumberToPartsByDefault from './parseNumberToPartsByDefault';
import styles from './FormattedNumberView.module.css';

export const SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL = 'Symbol between formatted number parts';

const FormattedNumberView = ({
    number,
    defaultFormatterOptions,
    formatter = getDefaultFormatter(defaultFormatterOptions),
    parseNumberToParts = parseNumberToPartsByDefault,
    numberPartsDividerClassName = ''
}: IFormattedNumberViewProps): JSX.Element => {
    const numberParts = useMemo(() => parseNumberToParts(formatter.format(number)), [parseNumberToParts, formatter, number]);

    return (
        <>
            {numberParts.map((numberPart, numberPartIndex) => {
                const isLastNumberPart = numberPartIndex === numberParts.length - 1;

                return (
                    <Fragment key={`${number}_${numberPart}`}>
                        {numberPart}
                        {!isLastNumberPart && (
                            <span
                                className={cn(styles.thinInextricableSpace, numberPartsDividerClassName)}
                                aria-label={SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL}
                            />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
};

export default FormattedNumberView;
