import { dirname, join } from 'path';
module.exports = {
    stories: [
        '../components/**/src/**/*.stories.@(js|jsx|ts|tsx)',
        '../components/**/src/**/*.docs.mdx',
        '../hooks/**/src/**/*.stories.@(js|jsx|ts|tsx)',
        '../hooks/**/src/**/*.docs.mdx',
        '../styles/**/*.stories.@(js|jsx|ts|tsx)',
        '../styles/**/*.docs.mdx'
    ],

    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-a11y'),
        getAbsolutePath('@storybook/addon-docs'),
        getAbsolutePath('@storybook/addon-mdx-gfm'),
        getAbsolutePath('@newhighsco/storybook-addon-svgr'),
        getAbsolutePath("@storybook/addon-mdx-gfm"),
        // getAbsolutePath("@storybook/addon-webpack5-compiler-swc")
    ],

    framework: '@storybook/react-vite',

    docs: {
        defaultName: 'Documentation'
    }
};

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}
