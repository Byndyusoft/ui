import React, { Fragment } from 'react';
import { INumberData, INumberViewProps } from './NumberView.types';
import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';
import getMaxFractionalPartOfNumbers from './getMaxFractionalPartOfNumbers';
import FootnoteView from './FootnoteView';
import styles from './NumberView.module.css';

export const THIN_INEXTRICABLE_SPACE_LABEL = 'Thin inextricable space symbol';

const NumberView = ({
    numbersData,
    className = '',
    formatterOptions = {},
    shouldRenderInline = false
}: INumberViewProps): JSX.Element => {
    const numbers = numbersData.map(({ number }) => number);

    const maxFractionalPart = getMaxFractionalPartOfNumbers(numbers);

    const mergedFormatterOptions = Object.assign({ minimumFractionDigits: maxFractionalPart }, formatterOptions);

    const formatter = new Intl.NumberFormat('ru', mergedFormatterOptions);

    const createNumberEntity = (
        { number, footnote }: INumberData,
        numberDataIndex: number,
        numbersDataArray: INumberViewProps['numbersData']
    ): JSX.Element => {
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

        const isLastNumber = numberDataIndex === numbersDataArray.length - 1;

        return (
            <Fragment key={number}>
                {footnote ? <FootnoteView {...footnote}>{numberElement}</FootnoteView> : numberElement}
                {!shouldRenderInline && !isLastNumber && <br />}
            </Fragment>
        );
    };

    return <>{numbersData.map(createNumberEntity)}</>;
};

NumberView.footnoteTypes = footnoteTypes;
NumberView.footnoteValueSizeMods = footnoteValueSizeMods;

export default NumberView;
