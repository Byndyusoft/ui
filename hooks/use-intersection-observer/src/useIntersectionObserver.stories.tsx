import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import useIntersectionObserver from './useIntersectionObserver';
import './useIntersectionObserver.stories.css';

type ITemplateProps = {
    title: string;
    options: any;
    isExperimental?: boolean;
};

function convertEntryToString(entry?: IntersectionObserverEntry) {
    if (!entry) return '';
    return `
    time: ${entry.time}
    rootBounds: ${JSON.stringify(entry.rootBounds)}
    boundingClientRect: ${JSON.stringify(entry.boundingClientRect)}
    intersectionRect: ${JSON.stringify(entry.intersectionRect)}
    isIntersecting: ${entry.isIntersecting}
    intersectionRatio: ${entry.intersectionRatio}
    target: ${entry.target.outerHTML}
  `;
}

const Template = ({ title, options, isExperimental }: ITemplateProps): JSX.Element => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { ref, inView, entry } = useIntersectionObserver({
        root: wrapperRef.current,
        onChange: (inView, entry) => console.log(inView, entry),
        ...options
    });

    return (
        <div className="wrapper">
            <div className="status-bar">
                <h2 className="status-bar-title">{title}</h2>
                {isExperimental && (
                    <div className="status-bar-warning">
                        <p className="warning">Warning: The {title} feature may not work in all browsers.</p>
                        <a
                            className="warning"
                            href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver"
                            target="_blank"
                        >
                            Read more.
                        </a>
                    </div>
                )}
                <div className="status-bar-in-view">
                    <span>In View:</span>
                    <span className={`status-label ${inView ? 'in-view' : 'out-of-view'}`}>{String(inView)}</span>
                    <span>Entry:</span>
                    <button onClick={() => alert(convertEntryToString(entry))}>Show entry</button>
                </div>
            </div>
            <div ref={wrapperRef} className="scroll-container">
                <div className="scroll-down">Scroll down</div>
                {!!options?.rootMargin && (
                    <div className="root-margin-visual" style={{ height: options.rootMargin }}>
                        {options.rootMargin}
                    </div>
                )}
                <div ref={ref} className={`observed-element ${inView ? 'in-view' : 'out-of-view'}`}>
                    {inView ? 'In View' : 'Out of View'}
                </div>
                {!!options?.rootMargin && (
                    <div className="root-margin-visual" style={{ height: options.rootMargin }}>
                        {options.rootMargin}
                    </div>
                )}
                <div className="scroll-up">Scroll up</div>
            </div>
        </div>
    );
};

export const Default: StoryObj<typeof Template> = {
    args: {
        options: {},
        title: 'Default Settings'
    }
};

export const Threshold: StoryObj<typeof Template> = {
    args: {
        options: {
            threshold: 0.5
        },
        title: 'Threshold: 0.5'
    }
};

export const RootMargin: StoryObj<typeof Template> = {
    args: {
        options: {
            rootMargin: '50px'
        },
        title: 'Root Margin: 50px'
    }
};

export const Skip: StoryObj<typeof Template> = {
    args: {
        options: {
            skip: true
        },
        title: 'skip: true'
    }
};

export const TriggerOnce: StoryObj<typeof Template> = {
    args: {
        options: {
            triggerOnce: true
        },
        title: 'Trigger Once'
    }
};

export const OnChange: StoryObj<typeof Template> = {
    args: {
        options: {
            onChange: (inView: boolean) => alert(`inView: ${inView}`)
        },
        title: 'OnChange'
    }
};

export const Delay: StoryObj<typeof Template> = {
    args: {
        options: {
            delay: 1000
        },
        title: 'Delay',
        isExperimental: true
    }
};

const meta: Meta<typeof Template> = {
    title: 'hooks/useIntersectionObserver',
    component: Template,
    argTypes: {
        options: {
            control: 'object'
        },
        title: {
            control: 'text'
        },
        isExperimental: {
            control: 'boolean'
        }
    }
};

export default meta;
