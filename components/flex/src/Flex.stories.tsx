import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { IFlexProps } from './Flex.types';
import Flex from './Flex';
import styles from './FlexStories.module.css';
import cn from "classnames";

const meta: Meta<typeof Flex> = {
    title: 'components/Flex',
    component: Flex
};

export default meta;

const FlexContent = () => {
    return (
        <>
            <div className={styles.flexContent} />
            <div className={cn(styles.flexContent, styles.flexContentBig)} />
            <div className={styles.flexContent} />
            <div className={cn(styles.flexContent, styles.flexContentMid)} />
        </>
    );
};

const Template = (args: IFlexProps): JSX.Element => (
    <Flex {...args} className={styles.templateContainer}>
        <FlexContent />
    </Flex>
);

export const Default: StoryObj<typeof Template> = {
    render: Template,
    args: {}
};
