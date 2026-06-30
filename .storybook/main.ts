import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

function getAbsolutePath(value: string): string {
    return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
    stories: [
        '../@(components|hooks)/**/src/**/*.stories.@(js|jsx|ts|tsx)',
        '../@(components|hooks)/**/src/**/*.docs.mdx',
        '../styles/**/*.stories.@(js|jsx|ts|tsx)',
        '../styles/**/*.docs.mdx'
    ],

    addons: [
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-a11y'),
        getAbsolutePath('@storybook/addon-actions')
    ],

    framework: getAbsolutePath('@storybook/react-vite'),

    docs: {
        defaultName: 'Documentation'
    },

    typescript: {
        // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
        reactDocgen: 'react-docgen-typescript',
        check: false
    },

    // FIXME: Проблема в несовместимости: Storybook/Vite грузит workspace dist/index.js как ESM, а dist собран в CommonJS.
    // Удалить после перевода сборок пакетов в ESM
    viteFinal: config => ({
        ...config,
        resolve: {
            ...config.resolve,
            alias: {
                ...config.resolve?.alias,
                '@byndyusoft-ui/local-storage': join(__dirname, '../services/local-storage/src'),
                '@byndyusoft-ui/use-event-listener': join(__dirname, '../hooks/use-event-listener/src'),
                '@byndyusoft-ui/use-latest-ref': join(__dirname, '../hooks/use-latest-ref/src'),
                '@byndyusoft-ui/use-throttled-callback': join(__dirname, '../hooks/use-throttled-callback/src'),
                '@byndyusoft-ui/use-timeout': join(__dirname, '../hooks/use-timeout/src'),
                '@byndyusoft-ui/use-toggle': join(__dirname, '../hooks/use-toggle/src')
            }
        }
    })
};

export default config;
