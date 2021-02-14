import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Overlay from './Overlay';
import './Overlay.stories.css';

export const DefaultStory: Story = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Показать оверлей
            </button>
            <Overlay isOpen={isOpen}>
                <p>Цвет фона: rgba(0, 0, 0, 0.5)</p>
                <button type="button" onClick={() => setIsOpen(false)}>
                    Скрыть оверлей
                </button>
            </Overlay>
        </>
    );
};

DefaultStory.storyName = 'Default';

export const CustomBackgroundColorStory: Story = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="OverlayCustomBackgroundColorStory">
            <button type="button" onClick={() => setIsOpen(true)}>
                Показать оверлей
            </button>
            <Overlay isOpen={isOpen}>
                <p>Цвет фона: rgba(30, 30, 130, 0.3)</p>
                <button type="button" onClick={() => setIsOpen(false)}>
                    Скрыть оверлей
                </button>
            </Overlay>
        </div>
    );
};

CustomBackgroundColorStory.storyName = 'Custom background color';

const meta: Meta = {
    title: 'components/Overlay',
    component: Overlay
};

export default meta;
