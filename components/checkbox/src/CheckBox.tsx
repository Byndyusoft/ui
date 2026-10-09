import React, { JSX, forwardRef } from 'react';

import { ICheckBoxProps } from './CheckBox.types';
import getDefaultCheckBoxClassNames from './utilities/getDefaultCheckBoxClassNames';

import CheckBoxContainer from './partials/CheckBoxContainer';
import CheckBoxIndicator from './partials/CheckBoxIndicator';
import CheckBoxLabel from './partials/CheckBoxLabel';

const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(
    (
        { children, classNames = getDefaultCheckBoxClassNames(), labelPosition = 'right', renderIndicator, ...props },
        ref
    ): JSX.Element => (
        <CheckBoxContainer classNames={classNames.container} ref={ref} {...props}>
            {labelPosition === 'left' && <CheckBoxLabel classNames={classNames.label}>{children}</CheckBoxLabel>}

            {renderIndicator ? (
                renderIndicator(classNames.indicator)
            ) : (
                <CheckBoxIndicator classNames={classNames.indicator} />
            )}

            {labelPosition === 'right' && <CheckBoxLabel classNames={classNames.label}>{children}</CheckBoxLabel>}
        </CheckBoxContainer>
    )
);

CheckBox.displayName = 'CheckBox';

export default CheckBox;
