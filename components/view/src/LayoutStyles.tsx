import React, { FC } from 'react';
import { getLayoutStyleEntries } from './layoutStylesRegistry';

export const LayoutStyles: FC = () => (
    <>
        {getLayoutStyleEntries().map(entry => (
            // eslint-disable-next-line react/no-danger -- CSS генерируется библиотекой из валидированной конфигурации
            <style key={entry.id} id={entry.id} dangerouslySetInnerHTML={{ __html: entry.css }} />
        ))}
    </>
);

LayoutStyles.displayName = 'LayoutStyles';
