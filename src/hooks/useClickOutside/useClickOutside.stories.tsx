import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import useClickOutside from './useClickOutside';

export const useClickOutsideStory: Story = () => {
    const [counterValue, setCounterValue] = useState<number>(0);
    const [ref] = useClickOutside(() => {
        setCounterValue(prevValue => prevValue + 1);
    });

    return (
        <div>
            <div>{`Counter: ${counterValue}`}</div>
            <div>
                <button type="button" ref={ref}>
                    Click me!
                </button>
            </div>
        </div>
    );
};

useClickOutsideStory.storyName = 'useClickOutside';

const meta: Meta = {
    title: 'Hooks/useClickOutside'
};

export default meta;
