import { useEffect, useState, useMemo } from 'react';

interface IUseImageProps {
    srcList: string | string[];
    decode?: boolean;
    crossOrigin?: string;
}

interface IUseImageResponse {
    src: string;
    isLoading: boolean;
    hasError: boolean;
}

function useImage({ srcList, decode = true, crossOrigin = '' }: IUseImageProps): IUseImageResponse {
    const [src, setSrc] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    const sourceKey = useMemo(() => {
        if (srcList && Array.isArray(srcList)) {
            return srcList.join('');
        } else if (srcList && Array.isArray(srcList) === false) {
            return srcList;
        }
        return srcList;
    }, [srcList]);

    useEffect(() => {
        if (srcList) {
            setLoading(true);
            setHasError(false);
            setSrc('');

            if (Array.isArray(srcList)) {
                // When image source is array of urls
                const promiseArray: Promise<string>[] = [];
                srcList.forEach(srcItem =>
                    promiseArray.push(
                        new Promise((resolve, reject) => {
                            const i = new Image();
                            if (crossOrigin) {
                                i.crossOrigin = crossOrigin;
                            }
                            i.onload = () => {
                                if (decode) {
                                    i.decode()
                                        .then(() => {
                                            resolve(srcItem);
                                        })
                                        .catch(reject);
                                } else {
                                    resolve(srcItem);
                                }
                            };
                            i.onerror = err => {
                                reject(err);
                                setHasError(true);
                                setLoading(false);
                            };
                            i.src = srcItem;
                        })
                    )
                );

                Promise.race(promiseArray)
                    .then(res => {
                        setSrc(res);
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                        setHasError(true);
                    });
            } else if (!Array.isArray(srcList)) {
                // When image source is a string
                new Promise<string>((resolve, reject) => {
                    const i = new Image();
                    if (crossOrigin) {
                        i.crossOrigin = crossOrigin;
                    }
                    i.onload = () => {
                        if (decode) {
                            i.decode()
                                .then(() => {
                                    resolve(srcList);
                                })
                                .catch(reject);
                        } else {
                            resolve(srcList);
                        }
                    };
                    i.onerror = err => {
                        reject(err);
                    };
                    i.src = srcList;
                })
                    .then(res => {
                        setSrc(res);
                        setLoading(false);
                    })
                    .catch(() => {
                        setHasError(true);
                        setLoading(false);
                    });
            }
        }
    }, [sourceKey, crossOrigin, decode]);

    return { src, isLoading, hasError };
}

export default useImage;
