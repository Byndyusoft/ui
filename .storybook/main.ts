import { dirname, join } from 'path';
import type {StorybookConfig} from '@storybook/react-vite';

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config:StorybookConfig = {
    stories: [
        '../@(components|hooks)/**/src/**/*.stories.@(js|jsx|ts|tsx)',
        '../@(components|hooks)/**/src/**/*.docs.mdx',
        '../styles/**/*.stories.@(js|jsx|ts|tsx)',
        '../styles/**/*.docs.mdx'
    ],

    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-a11y'),
    ],

    framework: getAbsolutePath('@storybook/react-vite'),

    docs: {
        defaultName: 'Documentation'
    },

    typescript: {
        // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
        reactDocgen: 'react-docgen-typescript',
        check: false,
    },
};

export default config;

