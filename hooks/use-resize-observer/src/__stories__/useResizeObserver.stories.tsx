import React, { useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import useResizeObserver from '../index';

interface ISize {
    width: number;
    height: number;
}

interface IResizeObserverExampleProps {
    multiple?: boolean;
}

const ResizeObserverExample = ({ multiple = false }: IResizeObserverExampleProps): JSX.Element => {
    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);
    const [firstWidth, setFirstWidth] = useState(200);
    const [secondWidth, setSecondWidth] = useState(250);
    const [sizes, setSizes] = useState<{ first?: ISize; second?: ISize }>({});

    useResizeObserver(multiple ? [firstRef, secondRef] : [firstRef], entries => {
        setSizes(previousSizes => {
            const nextSizes = { ...previousSizes };

            entries.forEach(entry => {
                nextSizes[entry.target === firstRef.current ? 'first' : 'second'] = {
                    width: Math.round(entry.contentRect.width),
                    height: Math.round(entry.contentRect.height)
                };
            });

            return nextSizes;
        });
    });

    return (
        <div style={{ display: 'grid', gap: 16 }}>
            <p>Измените ширину кнопкой или потяните за угол блока.</p>
            <div
                ref={firstRef}
                style={{ width: firstWidth, height: 100, resize: 'both', overflow: 'auto', background: '#ffcc33' }}
            >
                Первый элемент
            </div>
            <output>
                Первый элемент: {sizes.first ? `${sizes.first.width} × ${sizes.first.height}` : 'Ожидание измерения'}
            </output>
            <button type="button" onClick={() => setFirstWidth(width => (width === 200 ? 300 : 200))}>
                Изменить ширину первого элемента
            </button>
            {multiple && (
                <>
                    <div
                        ref={secondRef}
                        style={{
                            width: secondWidth,
                            height: 100,
                            resize: 'both',
                            overflow: 'auto',
                            background: '#7bdefd'
                        }}
                    >
                        Второй элемент
                    </div>
                    <output>
                        Второй элемент:{' '}
                        {sizes.second ? `${sizes.second.width} × ${sizes.second.height}` : 'Ожидание измерения'}
                    </output>
                    <button type="button" onClick={() => setSecondWidth(width => (width === 250 ? 350 : 250))}>
                        Изменить ширину второго элемента
                    </button>
                </>
            )}
        </div>
    );
};

export const SingleElement: StoryObj<typeof ResizeObserverExample> = {
    name: 'Один элемент',
    render: () => <ResizeObserverExample />
};

export const MultipleElements: StoryObj<typeof ResizeObserverExample> = {
    name: 'Несколько элементов',
    render: () => <ResizeObserverExample multiple />
};

export default {
    title: 'hooks/useResizeObserver'
} satisfies Meta;
