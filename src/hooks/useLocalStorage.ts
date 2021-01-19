import { useCallback, useState, useEffect } from 'react';

const getInitialValue = <T>(key:string) : T | undefined => {
    const initialValue = localStorage.getItem(key) ?? undefined;

    if(initialValue){
        const parsedData = JSON.parse(initialValue) as T;
        if(parsedData){
            return parsedData;
        }
    }
    return undefined;
}

const writeToLocalStorage = (key: string, data: unknown) : void => {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(key, stringifiedData);
}

const clearLocalStorageByKey = (key: string) : void => {
    localStorage.removeItem(key);
}

export const clearEntireLocalStorage = () : void => {
    localStorage.clear();
}

type TUseLocalStorageResponse<T> = [data: T | undefined, setData: (value: T) => void, remove: () => void]

function useLocalStorage<T>(key: string): TUseLocalStorageResponse<T>{
    const [data, setData] = useState<T | undefined>(getInitialValue(key));

    const set = useCallback(localStorageData => {
        writeToLocalStorage(key, localStorageData);
        setData(localStorageData);
    },[key]);

    const remove = useCallback(()=>{
        clearLocalStorageByKey(key)
        setData(undefined);
    }, [key])

    const checkLocalStorage = useCallback(
        (e: StorageEvent) => {
          if (e.storageArea === window.localStorage) {
            if (key === e.key && e.newValue) {
              setData(JSON.parse(e.newValue));
            } else if(e.newValue === null) {
                remove();
            }
          }
        },
        [key],
      );

    useEffect(() => {
        window.addEventListener("storage", checkLocalStorage);
        return () => window.removeEventListener("storage", checkLocalStorage);
      }, [key]);

    return [data, set, remove]
}

export default useLocalStorage;