import React, { ComponentType, JSX, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ICheckBoxProps } from './CheckBox.types';
import CheckBox from './CheckBox';

const meta: Meta<typeof CheckBox> = {
    component: CheckBox,
    title: 'Components/CheckBox',
    args: {
        children: 'some text',
        isChecked: false,
        isDisabled: false,
        isIndeterminate: false,
        labelPosition: 'right',
        onChange() {}
    }
};

type TStory = StoryObj<typeof CheckBox>;

export const Default: TStory = {};

export const Checked: TStory = {
    args: {
        isChecked: true
    }
};

export const Indeterminate: TStory = {
    args: {
        isIndeterminate: true
    }
};

export const Disabled: TStory = {
    args: {
        isDisabled: true
    }
};

export const WithoutText: TStory = {
    args: {
        children: null
    }
};

export const MultilineText: TStory = {
    decorators: [
        (CurrentStory: ComponentType): JSX.Element => (
            // eslint-disable-next-line react/forbid-dom-props
            <div style={{ width: '300px' }}>
                <CurrentStory />
            </div>
        )
    ],
    args: {
        children:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam explicabo maiores mollitia nesciunt, nisi non quam voluptatibus. Debitis dolorem earum eius, esse eum facere iste quo temporibus vero voluptatem voluptatum.'
    }
};

export const TextLeftPosition: TStory = {
    args: {
        labelPosition: 'left'
    }
};

const CheckBoxPlayground = (): JSX.Element => {
    const [state1, setState1] = useState<ICheckBoxProps>({ isChecked: false });
    const [state2, setState2] = useState<ICheckBoxProps>({ isChecked: true });
    const [state3, setState3] = useState<ICheckBoxProps>({ isChecked: false, isIndeterminate: true });

    const prepareState = (isChecked: boolean): ICheckBoxProps =>
        isChecked ? { isChecked, isIndeterminate: false } : { isChecked };

    return (
        <div>
            <CheckBox
                {...state1}
                id="checkbox1"
                onChange={event => setState1(prevState => ({ ...prevState, ...prepareState(event.target.checked) }))}
            >
                Чекбокс 1
            </CheckBox>
            <br />
            <CheckBox
                {...state2}
                onChange={event => setState2(prevState => ({ ...prevState, ...prepareState(event.target.checked) }))}
            >
                Чекбокс 2
            </CheckBox>
            <br />
            <CheckBox
                {...state3}
                onChange={event => setState3(prevState => ({ ...prevState, ...prepareState(event.target.checked) }))}
            >
                Чекбокс 3
            </CheckBox>
        </div>
    );
};

export const Playground: TStory = {
    args: {},
    render() {
        return <CheckBoxPlayground />;
    }
};

export default meta;
