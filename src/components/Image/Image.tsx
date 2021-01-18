import React, { FC } from 'react';

interface IImageProps
    extends Partial<HTMLImageElement>,
        Omit<Partial<HTMLImageElement>, 'src' | 'alt' | 'onError' | 'onLoad'> {
    className?: string;
    src: string;
    bgPlaceholderColor?: string;
    alt?: string;
}

const Image: FC<IImageProps> = ({
    width = '100%',
    height = '100%',
    src,
    alt,
    title,
    className,
    bgPlaceholderColor
}) => {
    if (!src) {
        return (
            <div
                style={{
                    width,
                    height,
                    backgroundColor: bgPlaceholderColor
                }}
                className={className}
                title={title}
            />
        );
    }

    return (
        <img
            style={{
                width,
                height,
                backgroundColor: bgPlaceholderColor
            }}
            className={className}
            src={src}
            alt={alt}
            width={width}
            height={height}
            title={title}
        />
    );
};

export default Image;
