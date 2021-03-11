export type TThemeName = 'default' | 'dark';

interface ITheme extends Record<TThemeName, unknown> {}

const themes: ITheme = {
    default: undefined,
    dark: undefined
};

themes.default = require('../../themes/default/index.css');
themes.dark = require('../../themes/dark/index.css');

export default themes;
