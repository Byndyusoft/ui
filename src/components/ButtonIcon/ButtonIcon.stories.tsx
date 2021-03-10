import React from 'react';
import { Meta, Story } from '@storybook/react';
import ButtonIcon from './ButtonIcon';

const SomeIconComponent = ({ left, right }: { left?: boolean; right?: boolean }): JSX.Element => (
    // eslint-disable-next-line
    <span role="img" aria-label="emoji" style={{ paddingRight: left ? '1rem' : 0, paddingLeft: right ? '1rem' : 0 }}>
        😋
    </span>
);

export const LeftIcon: Story = () => <ButtonIcon leftIcon={<SomeIconComponent left />}>Test</ButtonIcon>;

LeftIcon.storyName = 'Left Icon';

export const RightIcon: Story = () => <ButtonIcon rightIcon={<SomeIconComponent right />}>Test</ButtonIcon>;

RightIcon.storyName = 'Right Icon';

export const LeftRightIcons: Story = () => (
    <ButtonIcon leftIcon={<SomeIconComponent left />} rightIcon={<SomeIconComponent right />}>
        Test
    </ButtonIcon>
);

LeftRightIcons.storyName = 'Left and right icon';

const meta: Meta = {
    title: 'components/ButtonIcon',
    component: ButtonIcon
};

export default meta;
