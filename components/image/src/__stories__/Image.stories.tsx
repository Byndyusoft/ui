import React, { useEffect, useRef, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import Image from '../Image';
import { ImageProps } from '../Image.types';
import ImagePlaceholder from './image-placeholder.png';
import cls from './Image.stories.module.css';

interface ISkeletonProps {
    width: number | string;
    height: number | string;
}

interface ITemplateProps {
    mockImageIds: Array<number>;
    imageProps: Partial<ImageProps>;
}

const generateRandomArray = (maxNumber: number, length: number): number[] => {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
        randomArray.push(randomNumber);
    }
    return randomArray;
};

const FallbackSkeleton = ({ width, height }: ISkeletonProps) => {
    return <div className={cls.skeleton} style={{ width, height }}></div>;
};

const ErrorFallbackComponent = ({ width, height }: ISkeletonProps) => {
    return (
        <div className={cls.errorFallback} style={{ width, height }}>
            Error Fallback
        </div>
    );
};

const Template = ({ mockImageIds, imageProps }: ITemplateProps): JSX.Element => {
    const ref = useRef<null | HTMLImageElement>(null);

    useEffect(() => {
        console.log('Template ref', ref.current);
    }, []);
    return (
        <div className={cls.wrapper}>
            {mockImageIds?.map((id, index) => (
                <Image
                    {...imageProps}
                    ref={ref}
                    key={index}
                    src={`https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`}
                />
            ))}
        </div>
    );
};

export const LazyFallbackSkeleton: StoryObj<typeof Template> = {
    args: {
        mockImageIds: generateRandomArray(826, 100),
        imageProps: {
            width: 300,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const LazyFallbackUrl: StoryObj<typeof Template> = {
    args: {
        mockImageIds: generateRandomArray(826, 100),
        imageProps: {
            width: 300,
            height: 300,
            fallbackUrl: ImagePlaceholder,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const PreloadFallbackSkeleton: StoryObj<typeof Template> = {
    args: {
        mockImageIds: generateRandomArray(826, 30),
        imageProps: {
            width: 300,
            height: 300,
            lazy: false,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const PreloadFallbackUrl: StoryObj<typeof Template> = {
    args: {
        mockImageIds: generateRandomArray(826, 30),
        imageProps: {
            width: 300,
            height: 300,
            lazy: false,
            fallbackUrl: ImagePlaceholder,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const ErrorFallback: StoryObj<typeof Template> = {
    args: {
        mockImageIds: [-1, -1, -1, -1, -1, -1],
        imageProps: {
            width: 300,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export default {
    title: 'components/Image',
    component: Template
};
