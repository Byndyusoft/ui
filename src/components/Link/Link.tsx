import React, { FC } from 'react';
import cn from 'classnames';
import './Link.css';

interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string;
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    isDisabled?: boolean;
}

const Link: FC<ILinkProps> = ({
    className,
    href,
    target,
    children,
    rel = 'noopener noreferrer',
    isDisabled,
    ...rest
}) => (
    <a
        className={cn('Link', isDisabled && 'Link--disabled', className)}
        rel={rel}
        href={href}
        target={target}
        {...rest}
    >
        {children}
    </a>
);

export default Link;
