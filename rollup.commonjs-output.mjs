export const commonjsOutput = {
    dir: 'dist',
    format: 'cjs',
    exports: 'named',
    interop: 'auto',
    // Node's ESM default import reads module.exports; retain .default for existing CJS consumers.
    footer: chunk => (chunk.isEntry ? 'module.exports = Object.assign(exports.default, exports);' : '')
};

export function importDeclarations() {
    return {
        name: 'import-declarations',
        generateBundle(options, bundle) {
            // Runtime stays CommonJS. These declarations describe its default/named exports to ESM consumers.
            for (const asset of Object.values(bundle)) {
                if (asset.type !== 'asset' || !asset.fileName.endsWith('.d.ts')) continue;
                this.emitFile({
                    type: 'asset',
                    fileName: asset.fileName.replace(/\.d\.ts$/, '.d.mts'),
                    source: String(asset.source).replace(
                        /((?:from\s*|import\s*\(\s*)['"])(\.[^'"]+)(['"])/g,
                        '$1$2.mjs$3'
                    )
                });
            }
        }
    };
}
