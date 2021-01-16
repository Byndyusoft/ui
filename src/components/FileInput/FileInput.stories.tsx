import React from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import FileInput from './FileInput';

export const FileInputStory: Story = () => (
    <FileInput onChangeHandler={action('onChangeHandler')} name="fileInput" component={<div>Загрузить...</div>} />
);

export const FileInputMultiple: Story = () => (
    <FileInput
        onChangeHandler={action('onChangeHandler')}
        name="fileInput"
        isMultiupload
        component={<div>Загрузить...</div>}
    />
);

export const FileInputUploadImage: Story = () => (
    <FileInput
        acceptFiles="image/*"
        onChangeHandler={action('onChangeHandler')}
        name="fileInput"
        component={<div>Загрузить...</div>}
    />
);

FileInputStory.storyName = 'Default';
FileInputMultiple.storyName = 'Multiupload';
FileInputUploadImage.storyName = 'Upload images';

const meta: Meta = {
    title: 'FileInput',
    component: FileInput
};

export default meta;
