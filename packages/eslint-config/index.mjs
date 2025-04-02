// @ts-check

import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import vitest from "eslint-plugin-vitest";
import testingLibrary from "eslint-plugin-testing-library";
import prettierFlatConfig from "eslint-config-prettier/flat";

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    prettierFlatConfig
);

// export default

//
// export default [
//     // Base ESLint recommended config
//     js.configs.recommended,
//     ts.configs.recommended,
//     // // TypeScript
//     // {
//     //     files: ["**/*.ts", "**/*.tsx"],
//     //     plugins: {
//     //         "@typescript-eslint": ts,
//     //     },
//     //     languageOptions: {
//     //         parser: tsParser,
//     //         parserOptions: {
//     //             ecmaFeatures: { jsx: true },
//     //             project: true, // Auto-detects tsconfig.json
//     //         },
//     //     },
//     //     rules: {
//     //         ...ts.configs.recommended.rules,
//     //         "@typescript-eslint/explicit-function-return-type": "off",
//     //         "@typescript-eslint/explicit-module-boundary-types": "off",
//     //         "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
//     //         "@typescript-eslint/no-explicit-any": "warn",
//     //     },
//     // },
//
//     // React
//     {
//         files: ["**/*.tsx", "**/*.jsx"],
//         plugins: {
//             react: reactPlugin,
//             "react-hooks": reactHooks,
//             "jsx-a11y": jsxA11y,
//         },
//         settings: {
//             react: {
//                 version: "detect",
//             },
//         },
//         languageOptions: {
//             globals: {
//                 React: "readonly",
//             },
//         },
//         rules: {
//             ...reactPlugin.configs.recommended.rules,
//             ...reactHooks.configs.recommended.rules,
//             ...jsxA11y.configs.recommended.rules,
//             "react/react-in-jsx-scope": "off",
//             "react/prop-types": "off",
//         },
//     },
//
//     // Import
//     {
//         plugins: {
//             import: importPlugin,
//         },
//         settings: {
//             "import/resolver": {
//                 typescript: {
//                     alwaysTryTypes: true,
//                 },
//             },
//         },
//         rules: {
//             ...importPlugin.configs.recommended.rules,
//             "import/order": [
//                 "error",
//                 {
//                     groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
//                     "newlines-between": "always",
//                     alphabetize: { order: "asc", caseInsensitive: true },
//                 },
//             ],
//         },
//     },
//
//     // Testing (Vitest + Testing Library)
//     {
//         files: ["**/*.test.ts", "**/*.test.tsx"],
//         plugins: {
//             vitest,
//             "testing-library": testingLibrary,
//         },
//         languageOptions: {
//             globals: {
//                 ...vitest.environments.env.globals,
//             },
//         },
//         rules: {
//             ...vitest.configs.recommended.rules,
//             ...testingLibrary.configs.react.rules,
//             "vitest/no-focused-tests": "error",
//             "vitest/no-identical-title": "error",
//             "@typescript-eslint/no-non-null-assertion": "off",
//             "@typescript-eslint/no-empty-function": "off",
//         },
//     },
//
//     // Global rules
//     {
//         rules: {
//             "no-console": "warn",
//             "no-debugger": "warn",
//         },
//     },
//
//     // Prettier (must be last)
//     prettierConfig,
// ];
