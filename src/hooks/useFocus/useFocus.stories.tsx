import React from 'react';
import { Meta, Story } from '@storybook/react';
import useFocus from '.';

export const useFocusStory: Story = (): JSX.Element => {
    const refToFocus = useFocus();

    return (
        <div>
            Input should be focused:
            <input type="text" ref={refToFocus} />
        </div>
    );
};

useFocusStory.storyName = 'useFocus';

const meta: Meta = {
    title: 'Hooks/useFocus'
};

export default meta;
