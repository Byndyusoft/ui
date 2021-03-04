import React, { FC } from 'react';
import cn from 'classnames';
import './Link.css';

interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    isDisabled?: boolean;
}

const Link: FC<ILinkProps> = ({ href, target, children, rel = 'noopener noreferrer', isDisabled, ...rest }) => (
    <a
        className={cn('Link', isDisabled && 'Link--disabled')}
        rel={rel}
        href={!isDisabled ? href : undefined}
        target={target}
        {...rest}
    >
        {children}
    </a>
);

export default Link;
