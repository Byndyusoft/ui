import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { InputType } from '@storybook/types';
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from './createFlex';
import { alignContentVariants, alignItemsVariants, directions, flexWraps, justifyContentVariants } from './Flex.types';

const config = {
    unit: '8px',
    grid: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2, xxl: 3 }
} as const;

const View = createView(config);
const Flex = createFlex(View);

const meta: Meta<typeof Flex> = {
    title: 'components/Flex/createFlex',
    component: Flex,
    parameters: {
        outline: true
    }
};
export default meta;

type TStory = StoryObj<typeof Flex>;

function FlexItem(): JSX.Element {
    return <div style={{ width: '4rem', height: '2rem', borderRadius: '0.5rem', background: 'skyblue' }} />;
}

const tokenControl: InputType = {
    options: Object.keys(config.grid),
    control: { type: 'select' }
};

export const Default: TStory = {
    args: {
        direction: 'row',
        gap: 'md',
        alignItems: 'center'
    },
    render: args => (
        <Flex {...args}>
            <FlexItem />
            <FlexItem />
            <FlexItem />
        </Flex>
    ),
    argTypes: {
        direction: { options: directions, control: { type: 'select' } },
        wrap: { options: flexWraps, control: { type: 'select' } },
        justifyContent: { options: justifyContentVariants, control: { type: 'select' } },
        alignContent: { options: alignContentVariants, control: { type: 'select' } },
        alignItems: { options: alignItemsVariants, control: { type: 'select' } },
        gap: tokenControl,
        rowGap: tokenControl,
        columnGap: tokenControl
    }
};

export const ColumnWithView: TStory = {
    render: () => (
        <Flex direction="column" gap="lg" padding="xl">
            <View padding="md" marginBottom="sm">
                <FlexItem />
            </View>
            <Flex gap="sm" alignItems="center">
                <FlexItem />
                <FlexItem />
            </Flex>
        </Flex>
    )
};
