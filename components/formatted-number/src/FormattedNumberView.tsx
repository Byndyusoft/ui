import React, { Fragment, useMemo } from 'react';
import cn from 'classnames';
import { IFormattedNumberViewProps } from './FormattedNumberView.types';
import styles from './FormattedNumberView.module.css';

export const THIN_INEXTRICABLE_SPACE_LABEL = 'Thin inextricable space symbol';

const FormattedNumberView = ({
    number,
    formatterOptions = {},
    classNames = {}
}: IFormattedNumberViewProps): JSX.Element => {
    const formatter = useMemo(() => new Intl.NumberFormat('ru', formatterOptions), [formatterOptions]);

    const formattedNumberParts = formatter.format(number).split(/\s/);

    return (
        <span className={classNames.container}>
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
};

export default FormattedNumberView;
