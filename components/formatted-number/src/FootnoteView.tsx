import React from 'react';
import cn from 'classnames';
import { IFootnote } from './FormattedNumberView.types';
import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';
import styles from './FootnoteView.module.css';

interface IFootnoteProps extends IFootnote {
    className?: string;
    children: React.ReactNode;
}

export const PARENTHESIS_FOOTNOTE_LABEL = 'Parenthesis footnote element label';

const FootnoteView = ({
    type,
    value = '',
    valueSizeModifier = null,
    className = '',
    children
}: IFootnoteProps): JSX.Element => {
    const supClasses = cn(
        styles.supFootnote,
        {
            [styles.smallerSupFootnoteSize]: valueSizeModifier === footnoteValueSizeMods.SMALLER
        },
        className
    );

    return (
        <>
            {type === footnoteTypes.SUP_TEXT && (
                <>
                    {children}
                    <sup className={supClasses}>{value}</sup>
                </>
            )}

            {type === footnoteTypes.PARENTHESES && (
                <span className={cn(styles.parenthesisFootnote, className)} aria-label={PARENTHESIS_FOOTNOTE_LABEL}>
                    {children}
                </span>
            )}
        </>
    );
};

export default FootnoteView;
