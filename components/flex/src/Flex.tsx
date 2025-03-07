import React, { FC } from 'react';
import View from "@byndyusoft-ui/view/src";
import { IFlexProps } from './Flex.types';
import styles from './Flex.module.scss';

const Flex: FC<IFlexProps> = ({ children, ...props }): JSX.Element => {
    return (
        <View className={styles.asd} {...props}>{children}</View>
    );
};

export default Flex;
