import React from 'react';
import { Meta, Story } from '@storybook/react';
import useAutofocus from '.';

export const useAutofocusStory: Story = (): JSX.Element => {
    const refToAutofocus = useAutofocus();

    return (
        <div>
            Input should be focused:
            <input type="text" ref={refToAutofocus} />
        </div>
    );
};

useAutofocusStory.storyName = 'useAutofocus';

const meta: Meta = {
    title: 'Hooks/useAutofocus'
};

export default meta;
