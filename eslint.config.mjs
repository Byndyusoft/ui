import { defineConfig } from 'eslint/config';
import config from '@byndyusoft/eslint-config-local/index.mjs';

console.log('config', config);

export default defineConfig([
    config
]);
