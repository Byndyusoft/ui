import React, { useEffect, useState } from 'react';
import { Meta } from '@storybook/react';
import Image from '.';
import useImage from '../../hooks/useImage';

export const DefaultImageStory = () => {
    const { src } = useImage({
        srcList: [
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image width={480} height={360} src={src} />;
};

export const BackgroundPlaceholderColor = () => {
    const { src } = useImage({
        srcList: [
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image bgPlaceholderColor="#3e3e3e" width={480} height={360} src={src} />;
};

export const ImageRaceLoading = () => {
    const { src } = useImage({
        srcList: [
            'https://i.pinimg.com/originals/e5/59/c5/e559c582fa17ad0f7672cd45e972b434.jpg',
            'https://img2.goodfon.com/wallpaper/nbig/c/56/matrica-kod-matrix.jpg',
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image src={src} width={480} height={360} />;
};

export const ImageOnError = () => {
    const { src, hasError } = useImage({
        srcList: 'https://failureurltouploadimage.com/ffffff?width=200&height=200'
    });

    return (
        <>
            <div>{`Image load is ${hasError ? 'failed' : 'not ready'}`}</div>
            <Image src={src} width={480} height={360} />
        </>
    );
};

export const ImageOnLoad = () => {
    const { src, isLoading } = useImage({
        srcList: 'https://img2.goodfon.com/wallpaper/nbig/c/56/matrica-kod-matrix.jpg'
    });

    return (
        <>
            <div>{`Image is ${isLoading ? 'loading' : 'loaded'}`}</div>
            <Image src={src} width={480} height={360} />
        </>
    );
};

DefaultImageStory.storyName = 'Default';
BackgroundPlaceholderColor.storyName = 'Background placeholder color';
ImageRaceLoading.storyName = 'First loaded image display';

const meta: Meta = {
    title: 'Components/Image',
    component: Image
};

export default meta;
