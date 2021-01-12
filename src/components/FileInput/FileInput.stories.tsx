import React from 'react';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import FileInput from './FileInput';

export const FileInputStory = () => (
    <FileInput onChangeHandler={action('onChangeHandler')} name="fileInput" component={<div>Загрузить...</div>} />
);

export const FileInputMultiple = () => (
    <FileInput
        onChangeHandler={action('onChangeHandler')}
        name="fileInput"
        isMultiupload={true}
        component={<div>Загрузить...</div>}
    />
);

export const FileInputUploadImage = () => (
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