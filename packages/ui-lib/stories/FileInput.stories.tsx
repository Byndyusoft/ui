import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import FileInput from '../src/FileInput';

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
    title: 'Components/FileInput',
    component: FileInput
};

export default meta;
