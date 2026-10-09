import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import typescript from 'typescript';

const packageName = '@byndyusoft-ui/http-client';
const requiredExports = ['FetchAdapter', 'HTTP_METHODS', 'HttpClient', 'XhrAdapter'];
const require = createRequire(import.meta.url);

const esmPackage = await import(packageName);
const cjsPackage = require(packageName);
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const declarations = await readFile(new URL('../dist/index.d.ts', import.meta.url), 'utf8');

assert.match(require.resolve(packageName), /\/dist\/index\.cjs$/);
assert.deepEqual(packageJson.exports['.'], {
    types: './dist/index.d.ts',
    import: './dist/index.js',
    require: './dist/index.cjs'
});
assert.equal(packageJson.engines.node, '>=20');
assert.equal(packageJson.sideEffects, false);
assert.equal(packageJson.type, 'module');
assert.doesNotMatch(declarations, /from\s+['"]\.\//);

await assert.rejects(import(`${packageName}/dist/index.js`), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
assert.throws(() => require(`${packageName}/dist/index.cjs`), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });

for (const exportName of requiredExports) {
    assert.notEqual(esmPackage[exportName], undefined, `Missing ${exportName} in the ESM entry`);
    assert.notEqual(cjsPackage[exportName], undefined, `Missing ${exportName} in the CommonJS entry`);
}

const typeResolution = typescript.resolveModuleName(
    packageName,
    fileURLToPath(import.meta.url),
    {
        module: typescript.ModuleKind.Node16,
        moduleResolution: typescript.ModuleResolutionKind.Node16
    },
    typescript.sys
).resolvedModule;

assert.notEqual(typeResolution, undefined, 'TypeScript cannot resolve the package declarations');
assert.match(typeResolution.resolvedFileName, /\/dist\/index\.d\.ts$/);

const esmEntryPath = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const virtualEntryId = '\0http-client-tree-shaking-check';
const bundle = await rollup({
    input: virtualEntryId,
    plugins: [
        {
            load(id) {
                if (id === virtualEntryId) {
                    return `export { HTTP_METHODS } from ${JSON.stringify(esmEntryPath)};`;
                }

                return null;
            },
            name: 'http-client-tree-shaking-check',
            resolveId(id) {
                if (id === virtualEntryId) {
                    return id;
                }

                return null;
            }
        }
    ]
});
const { output } = await bundle.generate({ format: 'esm' });
const generatedCode = output.map(chunk => ('code' in chunk ? chunk.code : '')).join('\n');

assert.match(generatedCode, /HTTP_METHODS/);
assert.doesNotMatch(generatedCode, /class HttpClient/);
assert.doesNotMatch(generatedCode, /class FetchAdapter/);
assert.doesNotMatch(generatedCode, /class XhrAdapter/);

await bundle.close();
