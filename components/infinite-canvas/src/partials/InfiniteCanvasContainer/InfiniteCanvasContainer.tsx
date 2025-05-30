import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { InfiniteCanvasContext } from '../../InfiniteCanvasContext';
import InfiniteCanvas from '../InfiniteCanvas/InfiniteCanvas';

const InfiniteCanvasContainer = ({ children }: PropsWithChildren<unknown>): ReactNode => {
    const [scale, setScale] = useState(1);

    return (
        <InfiniteCanvasContext.Provider
            value={{
                scale: scale,
                setScale
            }}
        >
            <InfiniteCanvas>{children}</InfiniteCanvas>
        </InfiniteCanvasContext.Provider>
    );
};

export default InfiniteCanvasContainer;
