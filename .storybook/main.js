module.exports = {
    stories: ['../@(components|hooks)/**/src/**/*.stories.@(tsx|mdx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        {
            name: '@storybook/addon-docs',
            options: {
                transcludeMarkdown: true
            }
        },
        'storybook-css-modules'
    ]
};
