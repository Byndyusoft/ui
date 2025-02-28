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
        {
            name: '@storybook/addon-docs',
            options: {
                transcludeMarkdown: true,
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
            }
        },
        getAbsolutePath('@storybook/addon-mdx-gfm'),
        getAbsolutePath('@newhighsco/storybook-addon-svgr')
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {
            builder: {
                useSWC: true,
                fsCache: true,
                lazyCompilation: true
            }
        }
    },

    docs: {
        autodocs: 'tag',
        defaultName: 'Documentation'
    }
};

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}
