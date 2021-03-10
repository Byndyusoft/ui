import React, { FC } from 'react';
import cn from 'classnames';
import './Toggle.css';

interface IToggleProps {
    checked: boolean;
    onToggle: (value: boolean) => void;
    isDisabled?: boolean;
}

const Toggle: FC<IToggleProps> = ({ checked, onToggle, isDisabled }) => (
    <button
        onClick={() => {
            if (!isDisabled) {
                onToggle(!checked);
            }
        }}
        type="button"
        className={cn('Toggle--container', checked && 'Toggle--checked', isDisabled && 'Toggle--container-isDisabled')}
    >
        <div className={cn('Toggle--sphere', checked ? 'Toggle--sphere-checked' : 'Toggle--sphere-unchecked')} />
    </button>
);

export default Toggle;
