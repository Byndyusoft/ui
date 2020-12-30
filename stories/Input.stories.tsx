import { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import Input, { Size } from '../src/components/Input';
import '../src/components/Input/Input.css';

export const InputTypeText = () => <Input name="default-input" />;
export const InputTypePassword = () => <Input name="default-input" type="password" />;
export const UncontrolledInput = () => {
    const inputRef = useRef<HTMLInputElement>();
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                action('Input value: ')(inputRef.current.value);
            }}
        >
            <Input
                inputRef={ref => {
                    inputRef.current = ref;
                }}
                name="default-input"
            />
            <br />
            <input type="submit" value="Send" />
        </form>
    );
};

export const InputSize = () => (
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

export const InputSideComponents = () => (
    <>
        <h3>With left component</h3>
        <Input defaultValue="123" name="withLeftComponent" leftComponent={<span>🔍</span>} />
        <h3>With right component</h3>
        <Input defaultValue="123" name="withRightComponent" rightComponent={<span>🔎</span>} />
        <h3>Both</h3>
        <Input
            defaultValue="123"
            name="bothComponents"
            leftComponent={<span>🔍</span>}
            rightComponent={<span>🔎</span>}
        />
    </>
);

InputTypeText.storyName = 'Input type text';
InputTypePassword.storyName = 'Input type password';
UncontrolledInput.storyName = 'Uncontrolled';
InputSize.storyName = 'Sizes';

const meta: Meta = {
    title: 'Components/Input',
    component: Input
};

export default meta;
