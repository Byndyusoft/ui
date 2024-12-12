import React, { useRef, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import useIntersectionObserver from '../useIntersectionObserver';
import styles from './useIntersectionObserver.stories.module.css';

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
    const targetRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [isIntersecting, entry] = useIntersectionObserver(targetRef, {
        root: scrollContainerRef.current,
        ...options
    });

    return (
        <div className={styles.wrapper}>
            <div className={styles.status_bar}>
                <h2 className={styles.status_bar_title}>{title}</h2>
                {isExperimental && (
                    <div className={styles.status_bar_warning}>
                        <p className={styles.warning}>Warning: The {title} feature may not work in all browsers.</p>
                        <a
                            className={styles.warning}
                            href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver"
                            target="_blank"
                        >
                            Read more.
                        </a>
                    </div>
                )}
                <div className={styles.status_bar_in_view}>
                    <span>isIntersecting:</span>
                    <span className={`${styles.status_label} ${isIntersecting ? styles.in_view : styles.out_of_view}`}>
                        {String(isIntersecting)}
                    </span>
                    <span>Entry:</span>
                    <button onClick={() => alert(convertEntryToString(entry))}>Show entry</button>
                </div>
            </div>
            <div ref={scrollContainerRef} className={styles.scroll_container}>
                <div className={styles.scroll_down}>Scroll down</div>
                {!!options?.rootMargin && (
                    <div className={styles.root_margin_visual} style={{ height: options.rootMargin }}>
                        {options.rootMargin}
                    </div>
                )}
                <div
                    ref={targetRef}
                    className={`${styles.observed_element} ${isIntersecting ? styles.in_view : styles.out_of_view}`}
                >
                    {isIntersecting ? 'In View' : 'Out of View'}
                </div>

                {!!options?.rootMargin && (
                    <div className={styles.root_margin_visual} style={{ height: options.rootMargin }}>
                        {options.rootMargin}
                    </div>
                )}
                <div className={styles.scroll_up}>Scroll up</div>
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
            onChange: (isIntersecting: boolean, entry: IntersectionObserverEntry) => {
                console.log('useIntersectionObserver onChange', isIntersecting, entry);
                if (isIntersecting) {
                    alert(`isIntersecting: ${isIntersecting}`);
                }
            }
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

export default {
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
