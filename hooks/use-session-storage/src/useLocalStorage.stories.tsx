import React, { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import useSessionStorage from "./useSessionStorage";

type TTokenTemplateStory = StoryObj<typeof TokenTemplate>;

const TokenTemplate = (): JSX.Element => {
    const [token, { setValue: setToken, removeValue: removeToken }] = useSessionStorage('access', '');
    const [inputValue, setInputValue] = useState('Brand new token');
    const handleClick = useCallback(() => {
        setToken(inputValue);
    }, [setToken, inputValue]);

    const handleClickDelete = () => {
        removeToken();
    };

    return (
        <section>
            <div>Session storage: {token ?? 'no token'}</div>
            <p>
                <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </p>

            <button type="button" onClick={handleClick}>
                Добавить токен
            </button>
            <p>
                <button onClick={handleClickDelete}>Удалить токен</button>
            </p>
        </section>
    );
};
export const Token: TTokenTemplateStory = {
    decorators: [() => <TokenTemplate />]
};

const meta: Meta = {
    title: 'hooks/useSessionStorage',
};

export default meta;
