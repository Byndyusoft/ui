import React, { FC } from 'react';
import cn from 'classnames';
import './Toggle.css';

interface IToggleProps {
    toggled: boolean;
    onToggle: (value: boolean) => void;
    isDisabled?: boolean;
}

const Toggle: FC<IToggleProps> = ({ toggled, onToggle, isDisabled }) => (
    <button
        onClick={() => {
            if (!isDisabled) {
                onToggle(!toggled);
            }
        }}
        type="button"
        className={cn('Toggle--container', toggled && 'Toggle--toggled', isDisabled && 'Toggle--container-isDisabled')}
    >
        <div className={cn('Toggle--sphere', toggled ? 'Toggle--sphere-toggled' : 'Toggle--sphere-untoggled')} />
    </button>
);

export default Toggle;
