import React, { ReactElement, useCallback, useContext, useRef, useState } from 'react';
import cn from 'classnames';
import { IInfiniteCanvasProps } from '../../InfiniteCanvas.types';
import { InfiniteCanvasContext } from '../../InfiniteCanvasContext';

import styles from './InfiniteCanvas.module.css';

const InfiniteCanvas = ({ className, children }: IInfiniteCanvasProps): ReactElement => {
    const { scale, setScale } = useContext(InfiniteCanvasContext);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [dragging, setDragging] = useState(false);

    const offsetXRef = useRef(0);
    const offsetYRef = useRef(0);
    const isDraggingRef = useRef(false);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setDragging(true);
            offsetXRef.current = e.clientX - offset.x;
            offsetYRef.current = e.clientY - offset.y;
            isDraggingRef.current = true;
        },
        [offset]
    );

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDraggingRef.current) {
            const newX = e.clientX - offsetXRef.current;
            const newY = e.clientY - offsetYRef.current;

            setOffset({
                x: newX,
                y: newY
            });
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        setDragging(false);
        isDraggingRef.current = false;
    }, []);

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const newScale = Math.min(Math.max(0.1, scale + e.deltaY * -0.001), 4);
            const scaleFactor = newScale / scale;

            // Calculate new offset to keep content under mouse stable
            const newOffsetX = mouseX - (mouseX - offset.x) * scaleFactor;
            const newOffsetY = mouseY - (mouseY - offset.y) * scaleFactor;

            setScale(newScale);
            setOffset({ x: newOffsetX, y: newOffsetY });
        },
        [scale, offset.x, offset.y]
    );

    return (
        <div
            className={cn(styles.container, className)}
            onWheel={handleWheel}
            style={{
                width: '860px',
                height: '640px',
                cursor: dragging ? 'grabbing' : 'grab'
            }}
        >
            {/* TODO: move separate partial */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }}
            >
                <pattern
                    id="pattern-hero"
                    x={offset.x % (20 * scale)}
                    y={offset.y % (20 * scale)}
                    width={20 * scale}
                    height={20 * scale}
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx={1 * scale} cy={1 * scale} r={1 * scale} fill="white" />
                </pattern>

                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-hero)" />
            </svg>

            <div
                className={styles.backLayer}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            />

            <div
                className={styles.inner}
                style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                    transformOrigin: '0 0'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default InfiniteCanvas;
