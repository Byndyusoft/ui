import React, { FC, useRef } from 'react';

interface IFileInputProps {
    children: JSX.Element;
    name: string;
    acceptFiles: string;
    isMultiupload?: boolean;
    onChangeHandler: (files: File[]) => void;
}

const FileInput: FC<IFileInputProps> = ({ children, name, acceptFiles, isMultiupload, onChangeHandler }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onClickHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesCollection: File[] = [];
        const target = e.target;
        if (target.files) {
            for (let i = 0; i < target.files.length; i += 1) {
                filesCollection.push(target.files[i]);
            }
            onChangeHandler(filesCollection);

            e.target.value = '';
        }
    };

    return (
        <>
            {/* toDo: unset default button's style */}
            <button onClick={onClickHandler}>{children}</button>
            <input
                ref={fileInputRef}
                name={name}
                accept={acceptFiles}
                multiple={!!isMultiupload}
                type="file"
                onInput={onInputHandler}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default FileInput;
