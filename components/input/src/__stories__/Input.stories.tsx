import React, { ReactNode } from 'react';
import { StoryObj } from '@storybook/react';
import Input from '../Input';
import { InputProps } from '../input.types';
import styles from './Input.stories.module.css';

const TemplateWrapper = ({ children }: { children: ReactNode }) => {
    return <div className={styles.template_wrapper}>{children}</div>;
};

const InputSizeTemplate = (args: InputProps) => (
    <TemplateWrapper>
        <Input size="s" variant="outline" placeholder="size s" />
        <Input size="m" variant="outline" placeholder="size m" />
        <Input size="l" variant="outline" placeholder="size l" />
        <Input size="xl" variant="outline" placeholder="size xl" />
    </TemplateWrapper>
);

const InputVariantTemplate = (args: InputProps) => (
    <TemplateWrapper>
        <Input variant="unstyled" placeholder="unstyled" />
        <Input variant="line" placeholder="line" />
        <Input variant="outline" placeholder="outline" />
    </TemplateWrapper>
);

const InputSideComponentsTemplate = (args: InputProps) => (
    <TemplateWrapper>
        <Input variant="outline" placeholder="Left component" leftComponent="🔍" />
        <Input variant="outline" placeholder="Right component" rightComponent="👁️" />
        <Input variant="outline" placeholder="Side components" leftComponent="🔍" rightComponent="👁️" />
    </TemplateWrapper>
);

const InputInvalidTemplate = (args: InputProps) => (
    <TemplateWrapper>
        <Input variant="unstyled" placeholder="isInvalid unstyled" isInvalid />
        <Input variant="line" placeholder="isInvalid line" isInvalid />
        <Input variant="outline" placeholder="isInvalid outline" isInvalid />
    </TemplateWrapper>
);

export const InputSizeStory: StoryObj<typeof InputSizeTemplate> = {
    name: 'InputSize',
    render: InputSizeTemplate
};

export const InputVariantStory: StoryObj<typeof InputVariantTemplate> = {
    name: 'InputVariant',
    render: InputVariantTemplate
};

export const InputSideComponentsStory: StoryObj<typeof InputSideComponentsTemplate> = {
    name: 'InputSideComponents',
    render: InputSideComponentsTemplate
};

export const InputInvalidTemplateStory: StoryObj<typeof InputInvalidTemplate> = {
    name: 'InputInvalidTemplate',
    render: InputInvalidTemplate
};

export default {
    title: 'components/Input'
};
