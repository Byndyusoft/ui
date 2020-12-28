import React from 'react';

interface Props {
    x?: number;
    y?: number;
    inline?: boolean;
    className?: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;

export type SpacerProps = Props & NativeAttrs;

export const getMargin = (num: number): string => {
    return `calc(${num}rem - 1px)`;
};

const Spacer: React.FC<SpacerProps> = ({ x = 1, y = 1, inline = false, className = '', ...props }) => {
    const left = getMargin(x);
    const top = getMargin(y);

    const styles = {
        display: inline ? 'inline-block' : 'block',
        height: '1px',
        width: '1px',
        marginLeft: left,
        marginTop: top
    };

    return <span className={className} {...props} style={styles}></span>;
};

export default Spacer;
