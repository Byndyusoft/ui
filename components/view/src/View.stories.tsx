import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import View from './View';
import { spacingUnits } from './View.types';
import { InputType } from '@storybook/types';

const meta: Meta<typeof View> = {
    title: 'components/View',
    component: View,
    parameters: {
        outline: true
    }
};
export default meta;

type TStory = StoryObj<typeof View>;

function ViewContent(): JSX.Element {
    return <div style={{ width: '100%', height: '2rem', borderRadius: '0.5rem', background: 'skyblue' }} />;
}

const spaceControl: InputType = {
    options: spacingUnits,
    control: { type: 'select' }
};

export const Default: TStory = {
    args: {
        children: ViewContent
    },
    render: args => (
        <View {...args}>
            <ViewContent />
        </View>
    ),
    argTypes: {
        padding: spaceControl,
        margin: spaceControl,
        paddingTop: spaceControl,
        paddingBottom: spaceControl,
        paddingLeft: spaceControl,
        paddingRight: spaceControl,
        paddingVertical: spaceControl,
        paddingHorizontal: spaceControl,
        marginTop: spaceControl,
        marginLeft: spaceControl,
        marginRight: spaceControl,
        marginBottom: spaceControl,
        marginHorizontal: spaceControl,
        marginVertical: spaceControl
    }
};
