import React, { useRef, useState } from 'react';
import { StoryObj } from '@storybook/react';
import useScrollLock from '../useScrollLock';
import styles from './useScrollLock.stories.module.css';

const TemplateWithoutTarget = (): React.ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useScrollLock(isModalOpen);

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Open modal</button>

            {isModalOpen && (
                <div className={styles.modal}>
                    <h3>Modal window</h3>
                    <p>When this window is opened, the scrolling of the body is blocked</p>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            )}

            <div className={styles.content}>Long content to demonstrate scrolling...</div>
        </div>
    );
};

const TemplateWithTarget = (): React.ReactNode => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useScrollLock(isModalOpen, modalRef.current);

    return (
        <div ref={modalRef} className={styles.container}>
            <button onClick={() => setIsModalOpen(true)}>Open modal</button>

            {isModalOpen && (
                <div className={styles.modal}>
                    <h3>Modal window</h3>
                    <p>When this window is opened, the scrolling of the element is blocked</p>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            )}

            <div className={styles.content}>Long content to demonstrate scrolling...</div>
        </div>
    );
};

export const UseScrollLockWithoutTarget: StoryObj<typeof TemplateWithoutTarget> = {
    name: 'useScrollLock without target',
    render: TemplateWithoutTarget
};

export const UseScrollLockWithTarget: StoryObj<typeof TemplateWithTarget> = {
    name: 'useScrollLock with target',
    render: TemplateWithTarget
};

export default {
    title: 'hooks/useScrollLock'
};
