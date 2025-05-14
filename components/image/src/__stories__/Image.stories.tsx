import React, { useState } from 'react';
import type { StoryObj } from '@storybook/react';
import Image from '../Image';
import { IImageProps } from '../Image.types';
import imagePlaceholder from './image-placeholder.png';
import cls from './Image.stories.module.css';

interface ISkeletonProps {
    width: number | string;
    height: number | string;
}

interface ITemplateProps {
    imageProps: Partial<IImageProps>;
    mockLoadImageIds: () => Array<number>;
}

const generateRandomArray = (maxNumber: number, length: number): number[] => {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
        randomArray.push(randomNumber);
    }
    return randomArray;
};

const FallbackSkeleton = ({ width, height }: ISkeletonProps): JSX.Element => (
    <div className={cls.skeleton} style={{ width, height }} />
);

const ErrorFallbackComponent = ({ width, height }: ISkeletonProps): JSX.Element => (
    <div className={cls.errorFallback} style={{ width, height }}>
        Error Fallback
    </div>
);

const Template = ({ mockLoadImageIds, imageProps }: ITemplateProps): JSX.Element => {
    const [idList, setIdList] = useState(mockLoadImageIds() || []);

    const onRefreshIdList = () => {
        if (!mockLoadImageIds) return;
        setIdList(mockLoadImageIds);
    };

    return (
        <div className={cls.wrapper}>
            <button className={cls.refresh_btn} onClick={onRefreshIdList}>
                Refresh
            </button>
            {idList?.map((id, index) => (
                <Image
                    {...imageProps}
                    key={`${id}_${index + 1}`}
                    src={`https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`}
                />
            ))}
        </div>
    );
};

export const LazyFallbackSkeleton: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => generateRandomArray(826, 50),
        imageProps: {
            width: 300,
            height: 300,
            lazy: true,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const LazyFallbackSrc: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => generateRandomArray(826, 50),
        imageProps: {
            width: 300,
            height: 300,
            lazy: true,
            fallbackSrc: imagePlaceholder,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const PreloadFallbackSkeleton: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => generateRandomArray(826, 30),
        imageProps: {
            width: 300,
            height: 300,
            lazy: false,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const PreloadFallbackSrc: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => generateRandomArray(826, 30),
        imageProps: {
            width: 300,
            height: 300,
            lazy: false,
            fallbackSrc: imagePlaceholder,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const ErrorFallback: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => [-1, -2, -3, -4, -5, -6],
        imageProps: {
            width: 300,
            height: 300,
            lazy: true,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallback: <ErrorFallbackComponent width={300} height={300} />
        }
    }
};

export const ErrorFallbackSrc: StoryObj<typeof Template> = {
    args: {
        mockLoadImageIds: () => [-1, -2, -3, -4, -5, -6],
        imageProps: {
            width: 300,
            height: 300,
            lazy: true,
            fallback: <FallbackSkeleton width={300} height={300} />,
            errorFallbackSrc: imagePlaceholder
        }
    }
};

export default {
    title: 'components/Image',
    component: Template
};
