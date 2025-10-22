import React, { Fragment, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { IFormattedNumberViewProps } from './FormattedNumber.types';
import { getDefaultFormatter, parseNumberToPartsByDefault } from './FormattedNumber.utilities';

export const SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL = 'Symbol between formatted number parts';

const FormattedNumber = ({
    number,
    minusSymbol = '−',
    defaultFormatterOptions,
    formatter = getDefaultFormatter(defaultFormatterOptions),
    parseNumberToParts = parseNumberToPartsByDefault,
    numberPartsDividerClassName = ''
}: IFormattedNumberViewProps): JSX.Element => {
    const numberParts = useMemo(
        () => parseNumberToParts(formatter.format(Math.abs(number))),
        [parseNumberToParts, formatter, number]
    );

    return (
        <>
            {numberParts.map((numberPart, numberPartIndex) => {
                const isLastNumberPart = numberPartIndex === numberParts.length - 1;

                return (
                    <Fragment key={nanoid()}>
                        {numberPartIndex === 0 && number < 0 && minusSymbol}
                        {numberPart}
                        {!isLastNumberPart && (
                            /* eslint-disable react/forbid-dom-props */
                            // eslint-disable-next-line react/self-closing-comp
                            <span
                                style={{ userSelect: 'none' }}
                                className={numberPartsDividerClassName}
                                aria-label={SYMBOL_BETWEEN_FORMATTED_NUMBER_PARTS_LABEL}
                            >
                                &#8239;
                            </span>
                        )}
                    </Fragment>
                );
            })}
        </>
    );
};

export default FormattedNumber;
