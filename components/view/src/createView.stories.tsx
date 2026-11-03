import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { InputType } from '@storybook/types';
import { createView } from './createView';

const config = {
    step: { value: 8, unit: 'px' },
    values: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2, xxl: 3 }
} as const;

const View = createView(config);
const AppView = createView({ ...config, prefix: 'app' });

const meta: Meta<typeof View> = {
    title: 'components/View/createView',
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

const tokenControl: InputType = {
    options: Object.keys(config.values),
    control: { type: 'select' }
};

const spacingControls = Object.fromEntries(
    [
        'margin',
        'm',
        'marginTop',
        'mt',
        'marginRight',
        'mr',
        'marginBottom',
        'mb',
        'marginLeft',
        'ml',
        'marginHorizontal',
        'mh',
        'marginVertical',
        'mv',
        'padding',
        'p',
        'paddingTop',
        'pt',
        'paddingRight',
        'pr',
        'paddingBottom',
        'pb',
        'paddingLeft',
        'pl',
        'paddingHorizontal',
        'ph',
        'paddingVertical',
        'pv'
    ].map(name => [name, tokenControl])
);

export const Default: TStory = {
    args: {
        padding: 'lg',
        marginBottom: 'md'
    },
    render: args => (
        <View {...args}>
            <ViewContent />
        </View>
    ),
    argTypes: spacingControls
};

export const CustomPrefix: TStory = {
    args: {
        padding: 'xl',
        marginBottom: 'md'
    },
    render: args => (
        <div>
            <p>
                Prefix <code>app</code> задаёт отдельный namespace CSS-классов для этой сетки.
            </p>
            <AppView {...args}>
                <ViewContent />
            </AppView>
        </div>
    ),
    argTypes: spacingControls
};

export const CompactAliases: TStory = {
    args: {
        m: 'md',
        p: 'lg'
    },
    render: args => (
        <View {...args}>
            <ViewContent />
        </View>
    ),
    argTypes: spacingControls
};

export const CompactEqualSides: TStory = {
    args: {
        marginTop: 'md',
        marginRight: 'md',
        marginBottom: 'md',
        marginLeft: 'md'
    },
    render: args => (
        <View {...args}>
            <ViewContent />
        </View>
    ),
    argTypes: spacingControls
};
