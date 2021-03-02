import React from 'react';

interface ICloseIconProps {
    fill?: string;
}

const CloseIcon = ({ fill = 'black' }: ICloseIconProps): JSX.Element => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10.192 0.343994L5.94897 4.58599L1.70697 0.343994L0.292969 1.75799L4.53497 5.99999L0.292969 10.242L1.70697 11.656L5.94897 7.41399L10.192 11.656L11.606 10.242L7.36397 5.99999L11.606 1.75799L10.192 0.343994Z"
            fill={fill}
        />
    </svg>
);

export default CloseIcon;
