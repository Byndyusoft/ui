import React, { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import Input, { Size, Variant } from '.';
import './Input.css';

export const InputTypeText: Story = () => <Input placeholder="Placeholder" name="default-input" />;
export const InputTypePassword: Story = () => (
    <Input placeholder="Enter password" name="default-input" type="password" />
);
export const UncontrolledInput: Story = () => {
    const inputRef = useRef<HTMLInputElement>();
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (inputRef.current) {
                    action('Input value: ')(inputRef.current.value);
                }
            }}
        >
            <Input
                inputRef={ref => {
                    inputRef.current = ref;
                }}
                name="default-input"
            />
            <br />
            <br />
            <input type="submit" value="Send" />
        </form>
    );
};

export const InputSize: Story = () => (
    <>
        <h3>Input sizes</h3>
        <div>
            <div>
                <i>ExtraSmall</i>
            </div>
            <Input defaultValue="123" name="extraSmallInput" size={Size.ExtraSmall} />
        </div>
        <br />
        <div>
            <div>
                <i>Small</i>
            </div>
            <Input defaultValue="123" name="smallInput" size={Size.Small} />
        </div>
        <br />
        <div>
            <div>
                <i>Medium</i>
            </div>
            <Input defaultValue="123" name="mediumInput" size={Size.Medium} />
        </div>
        <br />
        <div>
            <div>
                <i>Large</i>
            </div>
            <Input defaultValue="123" name="largeInput" size={Size.Large} />
        </div>
        <br />
        <div>
            <div>
                <i>ExtraLarge</i>
            </div>
            <Input defaultValue="123" name="extraLargeInput" size={Size.ExtraLarge} />
        </div>
    </>
);

const SearchSpanLeft = (): JSX.Element => (
    <span role="img" aria-label="searchIcon" style={{ position: 'relative', top: '0.1rem', padding: '0 0.25rem' }}>
        🔍
    </span>
);
const SearchSpanRight = (): JSX.Element => (
    <span role="img" aria-label="searchIcon" style={{ position: 'relative', top: '0.1rem', padding: '0 0.25rem' }}>
        🔎
    </span>
);

export const InputSideComponents: Story = () => (
    <>
        <h3>With left component</h3>
        <Input defaultValue="123" name="withLeftComponent" leftComponent={<SearchSpanLeft />} />
        <h3>With right component</h3>
        <Input defaultValue="123" name="withRightComponent" rightComponent={<SearchSpanRight />} />
        <h3>Both</h3>
        <Input
            defaultValue="123"
            name="bothComponents"
            leftComponent={<SearchSpanLeft />}
            rightComponent={<SearchSpanRight />}
        />
    </>
);

export const InputVariants: Story = () => (
    <>
        <h3>Regular</h3>
        <Input defaultValue="123" name="regularVariant" variant={Variant.Regular} />
    </>
);

export const InputInvalid: Story = () => (
    <>
        <h3>Invalid</h3>
        <Input defaultValue="123" name="invalid" isInvalid />
    </>
);

export const InputDisabled: Story = () => (
    <>
        <h3>Disabled</h3>
        <Input defaultValue="123" name="disabled" isDisabled />
    </>
);

InputTypeText.storyName = 'Type text';
InputTypePassword.storyName = 'Type password';
UncontrolledInput.storyName = 'Uncontrolled';
InputSize.storyName = 'Sizes';
InputSideComponents.storyName = 'Side components';
InputVariants.storyName = 'Variants';
InputInvalid.storyName = 'isInvalid';
InputDisabled.storyName = 'isDisabled';

const meta: Meta = {
    title: 'Components/Input',
    component: Input
};

export default meta;
