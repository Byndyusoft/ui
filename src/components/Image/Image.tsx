import React, { FC } from 'react';

interface IImageProps extends Partial<HTMLImageElement>, Omit<Partial<HTMLImageElement>, 'src' | 'alt'> {
    bgPlaceholderColor?: string;
    bgPlaceholderImage?: string;
    className?: string;
    src: string;
    alt?: string;
}

const Image: FC<IImageProps> = ({
    width = '100%',
    height = '100%',
    src,
    bgPlaceholderColor = 'transparent',
    bgPlaceholderImage,
    alt,
    title,
    className
}) => {
    return (
        <img
            style={{
                width,
                height,
                backgroundColor: bgPlaceholderColor,
                backgroundImage: `url(${bgPlaceholderImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
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
