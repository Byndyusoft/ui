import { ButtonHTMLAttributes, HTMLAttributes } from 'react';

export const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type THeadingTag = (typeof tags)[number];

export interface IModalPartialProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export interface IModalCloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    id: string;
}

export interface IModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'className'> {
    id: string;
    onOpen?: () => void;
    onClose?: () => void;
}

export interface IModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    as?: THeadingTag;
}

export interface IModalProps extends IModalContainerProps {}
