import React, { FC } from 'react';
import { getStyleEntries } from './utilities';

export const ViewStylesInjector: FC = () => (
    <>
        {getStyleEntries().map(entry => (
            // eslint-disable-next-line react/no-danger -- CSS генерируется библиотекой из валидированной конфигурации
            <style key={entry.id} id={entry.id} dangerouslySetInnerHTML={{ __html: entry.css }} />
        ))}
    </>
);

ViewStylesInjector.displayName = 'ViewStylesInjector';
