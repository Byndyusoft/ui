import * as React from 'react';
import { useInterval } from '@byndyusoft-ui/hooks';
import { useEffect } from 'react';

const Button: React.FC = ({ children }) => {
    const [count, setCount] = React.useState(0);
    const {start, stop} = useInterval(() => {
        setCount(count + 1);
    });

    useEffect(() => {
        start(1000);
    }, [start]);

    return <button className="Button"> count: {count}</button>;
};

export default Button;
