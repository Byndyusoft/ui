import { dirname, join } from "path";
module.exports = {
    stories: ['../@(components|hooks)/**/src/**/*.stories.@(tsx|mdx)'],

    addons: [
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@storybook/addon-a11y"),
        {
            name: '@storybook/addon-docs',
            options: {
                transcludeMarkdown: true
            }
        },
        getAbsolutePath("@storybook/addon-mdx-gfm")
    ],

    framework: {
        name: getAbsolutePath("@storybook/react-webpack5"),
        options: {}
    },

    docs: {
        autodocs: true
    }
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}
