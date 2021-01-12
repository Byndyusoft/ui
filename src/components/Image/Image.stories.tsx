import React from 'react';
import { Meta } from '@storybook/react';
import Image from '.';

export const DefaultImageStory = () => {
    return (
        <Image
            width={480}
            height={360}
            src="https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970"
        />
    );
};

export const BackgroundPlaceholderColor = () => {
    return (
        <Image
            bgPlaceholderColor="#3e3e3e"
            width={480}
            height={360}
            src="https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970"
        />
    );
};

export const BackgroundPlaceholderImage = () => {
    return (
        <Image
            bgPlaceholderImage="https://miro.medium.com/max/500/0*-ouKIOsDCzVCTjK-.png"
            width={480}
            height={360}
            src="https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970"
        />
    );
};

export const WithFlexContainer = () => {
    return (
        <div style={{ display: 'flex', width: '400px', height: 300 }}>
            <Image
                bgPlaceholderImage="https://miro.medium.com/max/500/0*-ouKIOsDCzVCTjK-.png"
                src="https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970"
            />
            <Image
                bgPlaceholderImage="https://miro.medium.com/max/500/0*-ouKIOsDCzVCTjK-.png"
                src="https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?crop=entropy&cs=srgb&dl=pexels-pixabay-531321.jpg&fit=crop&fm=jpg&h=3313&w=4970"
            />
        </div>
    );
};

DefaultImageStory.storyName = 'Default';
BackgroundPlaceholderColor.storyName = 'Background placeholder color';
BackgroundPlaceholderImage.storyName = 'Background placeholder image';
WithFlexContainer.storyName = 'With flex container';

const meta: Meta = {
    title: 'Components/Image',
    component: Image
};

export default meta;
