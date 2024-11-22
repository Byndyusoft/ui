import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import { resetIntersectionMocking, setupIntersectionMocking } from './image.mocks';
import Image from '../Image';
import { IImageProps, IUseImageReturn } from '../Image.types';
import { useImage } from '../useImage';

jest.mock('../useImage');

interface ISetupProps {
    imageProps?: Partial<IImageProps>;
    useImageReturn?: Partial<IUseImageReturn>;
}

const useImageReturnMock = ({
    isLoading = false,
    isError = false,
    setObserverTargetRef = jest.fn()
}: Partial<IUseImageReturn> = {}) => {
    (useImage as jest.Mock).mockReturnValue({
        isLoading,
        isError,
        setObserverTargetRef
    });
};

const setup = (props: ISetupProps = {}): RenderResult => {
    const { imageProps, useImageReturn } = props;
    const requiredProps: IImageProps = {
        src: 'test-image.jpg',
        alt: 'Test Image'
    };

    useImageReturnMock(useImageReturn);

    return render(<Image {...requiredProps} {...imageProps} />);
};

describe('Image', () => {
    beforeEach(() => {
        setupIntersectionMocking(jest.fn);
    });
    afterEach(() => {
        resetIntersectionMocking();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('renders the image correctly', () => {
        setup();
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'test-image.jpg');
        expect(imgElement).toHaveAttribute('alt', 'Test Image');
    });

    test('renders fallback content when loading', () => {
        setup({
            imageProps: { fallback: <div>Loading...</div> },
            useImageReturn: { isLoading: true }
        });

        const fallbackElement = screen.getByText('Loading...');
        expect(fallbackElement).toBeInTheDocument();
    });

    test('renders fallbackSrc image when loading', () => {
        setup({
            imageProps: { fallbackSrc: 'fallback-image.jpg' },
            useImageReturn: { isLoading: true }
        });
        const fallbackImgElement = screen.getByAltText('Test Image');
        expect(fallbackImgElement).toBeInTheDocument();
        expect(fallbackImgElement).toHaveAttribute('src', 'fallback-image.jpg');
    });

    test('renders correctly when lazy is disabled', () => {
        setup({ imageProps: { lazy: false } });
        const imgElement = screen.getByAltText('Test Image');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'test-image.jpg');
    });

    test('renders error fallback content when image fails to load', () => {
        setup({
            imageProps: { errorFallback: <div>Error loading image</div>, lazy: false },
            useImageReturn: { isError: true }
        });
        const errorElement = screen.getByText('Error loading image');
        expect(errorElement).toBeInTheDocument();
    });
});
