import React from 'react';
import { Meta, Story } from '@storybook/react';
import Modal from './Modal';
import './Modal.css';

export const DefaultStory: Story = () => <Modal />;

DefaultStory.storyName = 'Default';

const meta: Meta = {
    title: 'components/Work in progress/Modal',
    component: Modal
};

export default meta;
