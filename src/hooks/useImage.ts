import { useEffect, useState, useMemo } from 'react';

interface IUseImageProps {
    srcList: string | string[];
    decode?: boolean;
    crossOrigin?: string;
}

function useImage({ srcList, decode = true, crossOrigin = '' }: IUseImageProps) {
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
        setLoading(true);
        setHasError(false);
        setSrc('');

        if (srcList && Array.isArray(srcList)) {
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
                            decode && i.decode
                                ? i
                                      .decode()
                                      .then(() => {
                                          resolve(srcItem);
                                      })
                                      .catch(reject)
                                : resolve(srcItem);
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
            Promise.race(promiseArray).then(res => {
                setSrc(res);
                setLoading(false);
            });
        } else if (srcList && !Array.isArray(srcList)) {
            // When image source is a string
            new Promise<string>((resolve, reject) => {
                const i = new Image();
                if (crossOrigin) {
                    i.crossOrigin = crossOrigin;
                }
                i.onload = () => {
                    decode && i.decode
                        ? i
                              .decode()
                              .then(() => {
                                  resolve(srcList);
                              })
                              .catch(reject)
                        : resolve(srcList);
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
    }, [sourceKey]);

    return { src, isLoading, hasError };
}

export default useImage;
