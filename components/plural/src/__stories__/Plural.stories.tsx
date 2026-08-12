import React from 'react';
import { StoryObj } from '@storybook/react';
import { IPluralProps } from '../Plural.types';
import Plural from '../Plural';

export const RuStory: StoryObj<(args: IPluralProps) => JSX.Element> = {
    name: 'ru',
    render: (args): JSX.Element => <Plural {...args} />,
    args: {
        count: 5,
        forms: {
            one: 'проект',
            few: 'проекта',
            many: 'проектов',
            other: 'проекта'
        },
        locale: 'ru'
    }
};

export const EnStory: StoryObj<(args: IPluralProps<'en'>) => JSX.Element> = {
    name: 'en',
    render: (args): JSX.Element => <Plural {...args} />,
    args: {
        count: 5,
        forms: {
            one: 'project',
            other: 'projects'
        },
        locale: 'en'
    }
};

export default {
    title: 'components/Plural',
    argTypes: {
        locale: {
            control: false
        }
    }
};
