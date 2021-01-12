import React, { FC } from 'react';

interface IImageProps extends Partial<HTMLImageElement>, Omit<Partial<HTMLImageElement>, 'src' | 'alt'> {
    bgPlaceholderColor?: string;
    bgPlaceholderImage?: string;
    className?: string;
    src: string;
    alt?: string;
}

const Image: FC<IImageProps> = ({
    width,
    height,
    src,
    bgPlaceholderColor = '#f8f8fc',
    bgPlaceholderImage,
    alt,
    title,
    className
}) => {
    return (
        <div
            style={{
                width,
                height,
                backgroundColor: bgPlaceholderColor,
                backgroundImage: `url(${bgPlaceholderImage})`,
                backgroundSize: 'contain'
            }}
            className={className}
        >
            <img className={className} src={src} alt={alt} width={width} height={height} title={title} />
        </div>
    );
};

export default Image;
