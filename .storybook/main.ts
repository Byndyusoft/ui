import { dirname, join } from 'path';
module.exports = {
    stories: ['../components/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],

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
        getAbsolutePath('@storybook/addon-mdx-gfm')
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

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
