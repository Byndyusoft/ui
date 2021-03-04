import React, { FC } from 'react';
import cn from 'classnames';
import './Link.css';

interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    isDisabled?: boolean;
}

const Link: FC<ILinkProps> = ({ href, target, children, rel = 'noopener noreferrer', isDisabled, ...rest }) => {
    if (isDisabled) {
        return <span className={cn('Link', 'Link--disabled')}>{children}</span>;
    }

    return (
        <a className="Link" rel={rel} href={href} target={target} {...rest}>
            {children}
        </a>
    );
};

export default Link;
