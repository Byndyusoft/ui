import React, { useEffect, useRef } from 'react';
import { StoryObj } from '@storybook/react';
import cn from 'classnames';
import { IOverlayProps } from '../Overlay.types';
import Overlay from '../Overlay';
import Loading from './Loading.svg';
import styles from './OverlayCustom.stories.module.css';
import './Overlay.stories.css';

const GeneralTemplate: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => (
    <div className="container">
        <div className="content">
            <p>Long content to demonstrate scrolling...</p>
            <Overlay {...args}>
                <div className="box">
                    <h1>Overlay</h1>
                    <p>Text in div overlay</p>
                </div>
            </Overlay>
        </div>
    </div>
);

const FrameTemplateWithModal: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [refElement, setRefElement] = React.useState<HTMLDivElement | null>(null);

    useEffect(() => {
        setRefElement(frameRef.current);
    }, []);

    return (
        <div className="container" ref={frameRef}>
            <div className="content">
                <p>Long content to demonstrate scrolling...</p>
                <Overlay {...args} refElement={refElement}>
                    <div className="box">
                        <h1>Overlay</h1>
                        <p>Text in div overlay</p>
                    </div>
                </Overlay>
            </div>
        </div>
    );
};

const FrameTemplateWithCustomProps: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [refElement, setRefElement] = React.useState<HTMLDivElement | null>(null);

    useEffect(() => {
        setRefElement(frameRef.current);
    }, []);

    return (
        <div className="container" ref={frameRef}>
            <div className="content">
                <p>Long content to demonstrate scrolling...</p>
                <Overlay {...args} refElement={refElement} />
            </div>
        </div>
    );
};

const FrameTemplateWithCustomStyles: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [refElement, setRefElement] = React.useState<HTMLDivElement | null>(null);

    useEffect(() => {
        setRefElement(frameRef.current);
    }, []);

    return (
        <div className="container" ref={frameRef}>
            <div className="content">
                <p>Long content to demonstrate scrolling...</p>
                <Overlay {...args} refElement={refElement} classNames={styles} />
            </div>
        </div>
    );
};

const FrameTemplateWithLoading: (args: IOverlayProps) => JSX.Element = (args: IOverlayProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [refElement, setRefElement] = React.useState<HTMLDivElement | null>(null);

    useEffect(() => {
        setRefElement(frameRef.current);
    }, []);

    return (
        <div className="container">
            <div className="content">
                <div className={cn('box', 'loadingBox')} ref={frameRef}>
                    <Overlay {...args} refElement={refElement}>
                        <img src={Loading} alt="Loading" />
                    </Overlay>
                    <h1>Overlay</h1>
                    <p>Text in div overlay</p>
                </div>
            </div>
        </div>
    );
};

export const GeneralOverlayStory: StoryObj<typeof GeneralTemplate> = {
    name: 'General overlay view',
    render: GeneralTemplate,
    args: {
        isVisible: false,
        center: true
    }
};

export const OverlayStoryWithModal: StoryObj<typeof FrameTemplateWithModal> = {
    name: 'Overlay view with centered modal',
    render: FrameTemplateWithModal,
    args: {
        isVisible: true,
        center: true,
        fixed: true
    }
};

export const OverlayStoryWithCustomProps: StoryObj<typeof FrameTemplateWithCustomProps> = {
    name: 'Overlay view with custom props',
    render: FrameTemplateWithCustomProps,
    args: {
        isVisible: true,
        color: '#87ceeb',
        backgroundOpacity: 0.6,
        blur: 2
    }
};

export const OverlayStoryWithCustomStyles: StoryObj<typeof FrameTemplateWithCustomStyles> = {
    name: 'Overlay view with custom styles',
    render: FrameTemplateWithCustomStyles,
    args: {
        isVisible: true
    }
};
export const OverlayStoryWithLoading: StoryObj<typeof FrameTemplateWithLoading> = {
    name: 'Overlay inside block',
    render: FrameTemplateWithLoading,
    args: {
        isVisible: true,
        center: true,
        color: '#87aaeb',
        backgroundOpacity: 0.6
    }
};

export default {
    title: 'components/Overlay',
    component: Overlay
};
