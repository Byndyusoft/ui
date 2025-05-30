import React, { PropsWithChildren, ReactElement, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { InfiniteCanvasContext } from '../../InfiniteCanvasContext';

// import styles from './MovableNode.module.css';

interface IMovableNode extends PropsWithChildren<unknown> {}

const MovableNode = ({ children }: IMovableNode): ReactElement => {
    const { scale } = useContext(InfiniteCanvasContext);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const initialOffsetXRef = useRef(0);
    const initialOffsetYRef = useRef(0);
    const isDraggingRef = useRef(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDraggingRef.current) {
                const newX = (e.clientX - initialOffsetXRef.current) / scale;
                const newY = (e.clientY - initialOffsetYRef.current) / scale;

                setOffset(() => ({
                    x: newX,
                    y: newY
                }));
            }
        },
        [scale]
    );

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            initialOffsetXRef.current = e.clientX - offset.x * scale;
            initialOffsetYRef.current = e.clientY - offset.y * scale;
            isDraggingRef.current = true;

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [offset, scale, handleMouseMove, handleMouseUp]
    );

    return (
        <div
            // className={styles.container}
            onMouseDown={handleMouseDown}
            style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`
            }}
        >
            {children}
        </div>
    );
};

export default MovableNode;
