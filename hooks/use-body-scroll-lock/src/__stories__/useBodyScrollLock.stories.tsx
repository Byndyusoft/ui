import React, { useState } from 'react';
import { StoryObj } from '@storybook/react';
import useBodyScrollLock from '../useBodyScrollLock';
import './useBodyScrollLock.stories.css';

const Template = (): JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useBodyScrollLock(isModalOpen);

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Open modal</button>

            {isModalOpen && (
                <div className="modal">
                    <h3>Modal window</h3>
                    <p>When this window is opened, the scrolling of the body is blocked</p>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            )}

            <div className="content">Long content to demonstrate scrolling...</div>
        </div>
    );
};

export const GeneralUseBodyScrollLockStory: StoryObj<typeof Template> = {
    name: 'General useBodyScrollLock story',
    render: Template
};

export default {
    title: 'hooks/useBodyScrollLock'
};
