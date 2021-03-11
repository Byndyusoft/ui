import React, { FC, useEffect, useState } from 'react';
import themes, { TThemeName } from './themes';

interface IThemeProviderProps {
    theme: TThemeName;
}

const ThemeProvider: FC<IThemeProviderProps> = ({ children, theme }) => {
    const [themeRequired, setThemeRequired] = useState<boolean>(false);
    useEffect(() => {
        // @ts-expect-error Magic happens
        themes[theme]();
        setThemeRequired(true);
    }, []);

    if (!themeRequired) {
        return null;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};

export default ThemeProvider;
