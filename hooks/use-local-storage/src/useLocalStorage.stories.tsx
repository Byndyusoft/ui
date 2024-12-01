import React, { useCallback, useRef, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import type { Meta, StoryObj } from '@storybook/react';

type TTokenTemplateStory = StoryObj<typeof TokenTemplate>;

const TokenTemplate = (): JSX.Element => {
    const [token, { setValue: setToken }] = useLocalStorage('access', '');

    const handleClick = useCallback(() => setToken('Brand new token'), [setToken]);

    return (
        <section>
            <div>Access token: {token ?? 'no token'}</div>
            <button type="button" onClick={handleClick}>
                Add to token to storage
            </button>
        </section>
    );
};
export const Token: TTokenTemplateStory = {
    decorators: [() => <TokenTemplate />]
};

const meta: Meta = {
    title: 'hooks/useLocalStorage'
};

export default meta;
