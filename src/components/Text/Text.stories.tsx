import React from 'react';
import { Meta, Story } from '@storybook/react';
import Text from './Text';

export const BodyStory: Story = () => (
    <Text>
        {`Мы изучаем автомобильные запчасти и ищем среди них поддельные.\n\nНаходки публикуем в каталоге, с подробным описанием. Описание помогает распознать подделку самостоятельно.`}
    </Text>
);

BodyStory.storyName = 'Body';

export const TitleStory: Story = () => <Text type="title">Мы изучаем автомобильные</Text>;

TitleStory.storyName = 'Title';

export const Heading1: Story = () => (
    <Text type="h1">{`Мы изучаем автомобильные запчасти\n\nИщем среди них поддельные`}</Text>
);

Heading1.storyName = 'Headline 1';

export const Heading2: Story = () => (
    <Text type="h2">
        {`Мы изучаем автомобильные запчасти и ищем среди них поддельные\n\nМы изучаем автомобильные запчасти и ищем среди них поддельные`}
    </Text>
);

Heading2.storyName = 'Headling 2';

export const Heading3: Story = () => (
    <Text type="h3">
        {`Мы изучаем автомобильные запчасти и ищем среди них поддельные\n\nМы изучаем автомобильные запчасти и ищем среди них поддельные`}
    </Text>
);

Heading3.storyName = 'Headling 3';

export const Caps: Story = () => (
    <Text type="caps">
        {`Мы изучаем автомобильные запчасти и ищем среди них поддельные.\n\nНаходки публикуем в каталоге, с подробным описанием. Описание помогает распознать подделку самостоятельно.`}
    </Text>
);

Caps.storyName = 'Caps';

export const Caption: Story = () => (
    <Text type="caption">
        {`Мы изучаем автомобильные запчасти и ищем среди них поддельные.\n\nНаходки публикуем в каталоге, с подробным описанием. Описание помогает распознать подделку самостоятельно.`}
    </Text>
);

Caption.storyName = 'Caption';

export const Wrapped: Story = () => (
    <>
        <div>
            <Text>{`Текстовый компонент обернутый в <span>\n\n`}</Text>
        </div>
        <Text type="caption" component={<span />}>
            {`Мы изучаем автомобильные запчасти и ищем среди них поддельные.\n\nНаходки публикуем в каталоге, с подробным описанием. Описание помогает распознать подделку самостоятельно.`}
        </Text>
    </>
);

Wrapped.storyName = 'Wrapped';

const meta: Meta = {
    title: 'components/Text',
    component: Text
};

export default meta;
