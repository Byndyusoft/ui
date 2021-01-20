import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import useClickInside from './useClickInside';

export const useClickInsideStory: Story = (): JSX.Element => {
    const [counterValue, setCounterValue] = useState<number>(0);
    const [ref] = useClickInside(() => {
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

useClickInsideStory.storyName = 'useClickInside';

const meta: Meta = {
    title: 'Hooks/useClickInside'
};

export default meta;
