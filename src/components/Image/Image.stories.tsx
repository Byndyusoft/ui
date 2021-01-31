import React from 'react';
import { Meta, Story } from '@storybook/react';
import Image from '.';
import useImage from '../../hooks/useImage';

export const DefaultImageStory: Story = () => {
    const { src } = useImage({
        srcList: [
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image width={480} height={360} src={src} />;
};

export const BackgroundPlaceholderColor: Story = () => {
    const { src } = useImage({
        srcList: [
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image bgPlaceholderColor="#3e3e3e" width={480} height={360} src={src} />;
};

export const ComponentPlaceholder: Story = () => {
    const { src } = useImage({
        srcList: [
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image placeholderComponent={<div>Image is loading</div>} width={480} height={360} src={src} />;
};

export const ImageRaceLoading: Story = () => {
    const { src } = useImage({
        srcList: [
            'https://i.pinimg.com/originals/e5/59/c5/e559c582fa17ad0f7672cd45e972b434.jpg',
            'https://img2.goodfon.com/wallpaper/nbig/c/56/matrica-kod-matrix.jpg',
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970'
        ]
    });

    return <Image src={src} width={480} height={360} />;
};

export const ImageOnError: Story = () => {
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

export const ImageOnLoad: Story = () => {
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
ComponentPlaceholder.storyName = 'Component placeholder';
ImageRaceLoading.storyName = 'First loaded image display';

const meta: Meta = {
    title: 'Components/Image',
    component: Image
};

export default meta;
