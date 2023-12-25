import React from 'react';
import cn from 'classnames';
import { IFootnote } from './NumberView.types';
import { footnoteTypes, footnoteValueSizeMods } from './footnoteEntities';
import styles from './FootnoteView.module.css';

interface IFootnoteProps extends IFootnote {
    children: React.ReactNode;
}

export const PARENTHESIS_FOOTNOTE_LABEL = 'Parenthesis footnote element label';

const FootnoteView = ({
    type,
    children,
    value = '',
    valueSizeModifier = null,
    className = ''
}: IFootnoteProps): JSX.Element => {
    const supClasses = cn(styles.supFootnote, {
        [styles.smallerSupFootnoteSize]: valueSizeModifier === footnoteValueSizeMods.SMALLER
    });

    return (
        <span className={cn(styles.footnoteContainer, className)}>
            {type === footnoteTypes.SUP_TEXT && (
                <>
                    {children}
                    <sup className={supClasses}>{value}</sup>
                </>
            )}

            {type === footnoteTypes.PARENTHESES && (
                <span className={styles.parenthesisFootnote} aria-label={PARENTHESIS_FOOTNOTE_LABEL}>
                    {children}
                </span>
            )}
        </span>
    );
};

export default FootnoteView;
