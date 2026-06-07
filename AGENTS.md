# AGENTS.md

## Monorepo structure

Turborepo + npm workspaces. Each component, hook, service, and style package is a separate npm package under `@byndyusoft-ui/` scope.

| Directory      | Purpose                        | Build tool                |
|----------------|--------------------------------|---------------------------|
| `components/*` | React UI components            | Rollup (`rollup --config`)|
| `hooks/*`      | React hooks                    | tsc (`tsc --project tsconfig.build.json`) |
| `packages/*`   | Shared types (`@byndyusoft-ui/types`) | tsc                |
| `services/*`   | Service packages (e.g. local-storage) | tsc            |
| `styles/*`     | CSS/style utilities (reset-css, keyframes-css, css-utilities) | Rollup |

Package entry point is always `src/index.ts`, built output goes to `dist/`.

## Commands

```bash
npm install                # install deps
npx postinstall            # init husky git hooks (also runs automatically on npm install)
npm run build              # clean + build all packages via turbo (must run after npm install)
npm start                  # storybook dev server on localhost:6009
npm test                   # vitest run with typecheck (all workspaces)
npm run test:watch         # vitest watch with typecheck
npm run lint:check         # eslint + stylelint + prettier check (all packages)
npm run lint:fix           # eslint + stylelint + prettier fix (all packages)
npm run prettier:check     # prettier check only
npm run prettier:fix       # prettier fix only
npm run eslint:check       # eslint only
npm run eslint:fix         # eslint fix only
npm run stylelint:check   # stylelint only
npm run stylelint:fix     # stylelint fix only
npm run set-changes        # interactive changeset creation (changeset)
npm run update-packages-versions  # apply changesets (bump versions + changelogs)
npm run publish            # changeset publish to npm
```

### Run a single package's tests

```bash
vitest run --root ../../ --project <package-name>
# Example: vitest run --root ../../ --project @byndyusoft-ui/use-timeout
```

The `<package-name>` is the npm `name` field from the package's `package.json`.

### CI order

lint:check → test → build → build-storybook

## Creating new entities

Use hygen templates:

```bash
npx hygen create component   # scaffolds a new component under components/
npx hygen create hook         # scaffolds a new hook under hooks/
```

Generated packages include `package.json`, `tsconfig.json`, `src/` with boilerplate, and a `rollup.config.mjs` (components) or `tsconfig.build.json` (hooks).

## Testing

- Vitest with `globals: true` and `jsdom` environment
- Test files use `*.tests.ts(x)` or `*.test.ts(x)` or `*.spec.ts(x)` patterns
- Type-check test files use `*.tests-d.ts` pattern (configured in root `vitest.config.mjs`)
- Setup: `setupTests.ts` (imports `@testing-library/jest-dom` and `vitest-localstorage-mock`)
- Packages with local `vitest.config.mjs` use `defineProject` + `mergeConfig` from root config

## Style & formatting

- Prettier: 4-space indent, single quotes, no trailing commas, 120 char width (2-space for JSON, double quotes for SCSS/CSS)
- ESLint: `@byndyusoft/eslint-config/typescript` + `typescript-style-frontend` + `react` + `react-testing` presets
- Stylelint: `@byndyusoft/stylelint-config` with SCSS extensions, `color-named` rule disabled
- Commit messages: conventional commits (enforced by `@commitlint/config-conventional`)
- Pre-commit hook: lint-staged runs prettier on staged files

## Publishing & releases

- Uses Changesets: `npm run set-changes` → `npm run update-packages-versions` → `npm run publish`
- Changesets config: `baseBranch: "master"`, `access: "public"`, `updateInternalDependencies: "patch"`
- Packages are published to npm under `@byndyusoft-ui/` scope

## Key quirks

- Root `lint-staged.config.js` has a typo: matches `{ts,tsx,js,jsx,json,css,scss,md}` without glob prefix — uses `prettier` command (not `prettier --write`), meaning it only checks, not fixes, on pre-commit
- React 17 peer dependency (not React 18)
- Node 20 required (enforced in CI and Docker build)
- Components use CSS Modules for stories (`*.module.css`) alongside SCSS for component styles (`*.scss`)
- Storybook runs on port **6009** (not the default 6006)
- ESLint config path in workspace packages references `../../eslint.config.js` — shared root config
- `eslint.config.js` overrides relax rules for test/story files (disables `no-magic-numbers`, `react/button-has-type`, `react/forbid-dom-props`, warns on `explicit-module-boundary-types`)