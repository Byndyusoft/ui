import React, { Fragment } from 'react';
import cn from 'classnames';
import { INumberViewProps } from './NumberView.types';
import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';
import FootnoteView from './FootnoteView';
import styles from './NumberView.module.css';

export const THIN_INEXTRICABLE_SPACE_LABEL = 'Thin inextricable space symbol';

const NumberView = ({ number, footnote, formatterOptions = {}, classNames = {} }: INumberViewProps): JSX.Element => {
    const formatter = new Intl.NumberFormat('ru', formatterOptions);

    const formattedNumberParts = formatter.format(number).split(/\s/);

    const numberElement = (
        <span className={classNames.number}>
            {formattedNumberParts.map((numberPart, numberPartIndex) => {
                const isLastNumberPart = numberPartIndex === formattedNumberParts.length - 1;

                return (
                    <Fragment key={`${number}_${numberPart}`}>
                        {numberPart}
                        {!isLastNumberPart && (
                            <span
                                className={cn(styles.thinInextricableSpace, classNames.space)}
                                aria-label={THIN_INEXTRICABLE_SPACE_LABEL}
                            />
                        )}
                    </Fragment>
                );
            })}
        </span>
    );

    return (
        <span className={cn(styles.container, classNames.container)}>
            {footnote ? (
                <FootnoteView {...footnote} className={classNames.footnote}>
                    {numberElement}
                </FootnoteView>
            ) : (
                numberElement
            )}
        </span>
    );
};

NumberView.footnoteTypes = footnoteTypes;
NumberView.footnoteValueSizeMods = footnoteValueSizeMods;

export default NumberView;
