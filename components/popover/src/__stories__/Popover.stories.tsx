import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Popover from '../PopoverContext';
import PopoverTrigger from '../partials/PopoverTrigger';
import PopoverContent from '../partials/PopoverContent';

const meta: Meta<typeof Popover> = {
    component: Popover,
    title: 'components/Popover',
    args: {
        initialOpen: undefined,
        shouldCloseOnClickOutside: false,
        placement: 'bottom-start',
        offset: 4,
        open: undefined,
        onOpenChange: undefined
    }
};

type TStory = StoryObj<typeof Popover>;

export const Default: TStory = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger>Click to show</PopoverTrigger>

            <PopoverContent width={300}>Click the trigger text to close</PopoverContent>
        </Popover>
    )
};

export const WithPortal: TStory = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger>Click to show</PopoverTrigger>

            <PopoverContent withPortal>Click the trigger text to close</PopoverContent>
        </Popover>
    )
};

export const FitContentWidthByContainer: TStory = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger>Click to show</PopoverTrigger>

            <PopoverContent>Click the trigger text to close</PopoverContent>
        </Popover>
    ),
    args: {
        fitContentWidthByContainer: true
    }
};

export const CloseOnClickOutsideOrPressEsc: TStory = {
    render: args => (
        <Popover {...args}>
            <PopoverTrigger>Click to show</PopoverTrigger>

            <PopoverContent>Try to click outside or press ESC</PopoverContent>
        </Popover>
    ),
    args: {
        shouldCloseOnClickOutside: true
    }
};

export default meta;
