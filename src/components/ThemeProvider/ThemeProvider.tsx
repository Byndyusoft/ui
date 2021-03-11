import React, { FC, useEffect } from 'react';
import themes, { TThemeName } from './themes';

interface IThemeProviderProps {
    theme: TThemeName;
}

const importTheme = (theme: TThemeName): void => {};

const ThemeProvider: FC<IThemeProviderProps> = ({ children, theme }) => {
    useEffect(() => {
        // @ts-expect-error Magic happens
        importTheme(themes[theme]);
    }, []);

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};

export default ThemeProvider;
