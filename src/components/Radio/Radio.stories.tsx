import React from 'react';
import { Meta, Story } from '@storybook/react';
import Radio from './Radio';

export const RadioStory: Story = () => {
    const [isChecked, setChecked] = React.useState<boolean>(false);

    return (
        <>
            <h1>Radio</h1>
            <div>
                <div>Actionable:</div>
                <Radio name="Russian Post" isChecked={isChecked} onChange={setChecked}>
                    Почта России
                </Radio>
            </div>
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div style={{ marginTop: 10 }}>
                <div>Disabled:</div>
                <Radio name="Unclickable" isChecked={isChecked} onChange={setChecked} isDisabled>
                    Unclickable
                </Radio>
            </div>
        </>
    );
};

RadioStory.storyName = 'Radio';

const meta: Meta = {
    title: 'components/Radio',
    component: Radio
};

export default meta;
