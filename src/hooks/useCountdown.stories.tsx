import React from 'react';
import { Meta, Story } from '@storybook/react';
import useCountdown from "./useCountdown";

export const useCountdownStory: Story = () => {
    const count = useCountdown({count: 5});

    return <div>
        {count ? count : 'отсчет закончен'}
    </div>
}


useCountdownStory.storyName = 'useCountdown';

const meta: Meta = {
    title: 'Hooks'
};

export default meta;