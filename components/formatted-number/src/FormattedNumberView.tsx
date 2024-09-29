import React, { Fragment, useMemo } from 'react';
import { IFormattedNumberViewProps } from './FormattedNumberView.types';
import getDefaultFormatter from './getDefaultFormatter';
import parseNumberToPartsByDefault from './parseNumberToPartsByDefault';

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

export default FormattedNumberView;
