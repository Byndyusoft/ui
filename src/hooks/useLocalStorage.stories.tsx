import React, { FC, createContext, useContext } from 'react';
import { Meta, Story } from '@storybook/react';
import useLocalStorage from './useLocalStorage';

type TLocalStorageContext<T> = [data: T | null, setData: (value: T) => void, remove: () => void]
type TLocalStorageStringContext = TLocalStorageContext<string>

const LocalStorageContext = createContext<TLocalStorageStringContext>([null, () => {}, () => {}]);

const LocalStorageProvider : FC = ({children}) => {
    const ctxValue = useLocalStorage<string>('userData');

    return <LocalStorageContext.Provider value={ctxValue}>
        {children}
        </LocalStorageContext.Provider>
}

const SomeComponent : FC = () => {
    const [userData] = useContext(LocalStorageContext);

    if(!userData){
        return <div>userData is undefined</div>
    }
    
    return(
        <div>{userData}</div>
    )
}

const AnotherComponent : FC = () => {
    const [userData, setUserData, clearUserData] = useContext(LocalStorageContext);

    return <div>{`AnotherComponent value is: ${userData ?? 'undefined'}`}
        <div>
            <button onClick={() => { setUserData('123') }} type="button">Set data to 123</button>
        </div>
        <div>
            <button onClick={() => { clearUserData() }} type="button">Clear</button>
        </div>
    </div>
}

export const useLocalStorageWithContextStory: Story = (): JSX.Element => <LocalStorageProvider>
        <SomeComponent/>
        <AnotherComponent/>
    </LocalStorageProvider>;

useLocalStorageWithContextStory.storyName = 'useLocalStorage with Context';

const meta: Meta = {
    title: 'Hooks/useLocalStorage'
};

export default meta;
