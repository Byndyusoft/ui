import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    symlinkSync,
    writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const releaseNames = new Set(
    JSON.parse(readFileSync(join(root, 'scripts', 'release-packages.json'), 'utf8')).packages.map(pkg => pkg.name)
);
const fixture = mkdtempSync(join(tmpdir(), 'byndyusoft-hook-packages-'));
const packages = new Map();
const hooks = [];

for (const group of ['hooks', 'services', 'packages', 'components']) {
    for (const entry of readdirSync(join(root, group), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const directory = join(root, group, entry.name);
        if (!existsSync(join(directory, 'package.json'))) continue;
        const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
        packages.set(manifest.name, { directory, manifest });
        if (group === 'hooks' && releaseNames.has(manifest.name)) hooks.push(manifest.name);
    }
}

const packed = new Set();

function pack(name) {
    if (packed.has(name)) return;
    const { directory, manifest } = packages.get(name);
    const usePublishedVersion = !releaseNames.has(name);
    const packResult = JSON.parse(
        execFileSync(
            'npm',
            [
                'pack',
                ...(usePublishedVersion
                    ? [`${name}@${manifest.version}`, '--registry=https://registry.npmjs.org']
                    : []),
                '--json',
                '--ignore-scripts',
                '--cache',
                join(fixture, '.npm-cache'),
                '--pack-destination',
                fixture
            ],
            {
                cwd: directory,
                encoding: 'utf8'
            }
        )
    );
    const archive = Array.isArray(packResult) ? packResult[0] : packResult[name];
    const destination = join(fixture, 'node_modules', name);
    mkdirSync(destination, { recursive: true });
    execFileSync('tar', ['-xzf', join(fixture, archive.filename), '--strip-components=1', '-C', destination]);
    const packedManifest = JSON.parse(readFileSync(join(destination, 'package.json'), 'utf8'));
    assert.ok(existsSync(join(destination, manifest.main)), `${name}: missing runtime entry`);
    assert.ok(existsSync(join(destination, manifest.types)), `${name}: missing declarations`);

    if (releaseNames.has(name)) {
        assert.equal(manifest.type, 'commonjs', `${name}: expected CommonJS package`);
        assert.equal(manifest.module, undefined, `${name}: unexpected ESM runtime entry`);
        assert.ok(
            archive.files.every(({ path }) => !path.endsWith('.mjs')),
            `${name}: unexpected ESM runtime file`
        );
        assert.ok(
            archive.files.every(
                ({ path }) => path.startsWith('dist/') || /^(package.json|README.*|LICENSE.*|CHANGELOG.*)$/.test(path)
            ),
            `${name}: source files leaked into the archive`
        );
        assert.ok(
            archive.files.every(({ path }) => !/\.(tests?|spec|stories|docs)[.-]|__tests__|__stories__/.test(path)),
            `${name}: test or story files leaked into the archive`
        );
    }

    packed.add(name);
    for (const dependency of Object.keys(packedManifest.dependencies ?? {})) {
        assert.ok(packages.has(dependency), `Add fixture support for external dependency ${dependency}`);
        pack(dependency);
    }
}

try {
    for (const name of hooks) pack(name);
    pack('@byndyusoft-ui/text-area');
    pack('@byndyusoft-ui/text-input');
    // Share only the consumer's React and test tools. Library packages come from npm archives.
    for (const name of ['react', 'react-dom', 'jsdom', '@testing-library/react-hooks', 'typescript', '@types/react']) {
        const destination = join(fixture, 'node_modules', name);
        mkdirSync(dirname(destination), { recursive: true });
        symlinkSync(join(root, 'node_modules', name), destination, 'dir');
    }
    writeFileSync(join(fixture, 'hooks.json'), JSON.stringify(hooks));
    // Verify the user's dependency chain with Node's native ESM loader, before setting up a DOM.
    execFileSync(
        process.execPath,
        [
            '--input-type=module',
            '--eval',
            `import assert from 'node:assert/strict';
             const hook = await import('@byndyusoft-ui/use-resize-observer');
             assert.equal(typeof hook.default, 'function');
             assert.equal(hook.default, hook.useResizeObserver);
             const component = await import('@byndyusoft-ui/text-area');
             assert.equal(component.default, component.TextArea);
             const input = await import('@byndyusoft-ui/text-input');
             assert.equal(input.default, input.TextInput);`
        ],
        { cwd: fixture, stdio: 'inherit' }
    );
    cpSync(join(root, 'scripts', 'fixtures', 'hook-packages.tests.mjs'), join(fixture, 'hook-packages.tests.mjs'));
    execFileSync(process.execPath, ['--test', join(fixture, 'hook-packages.tests.mjs')], { stdio: 'inherit' });
} finally {
    rmSync(fixture, { recursive: true, force: true });
}
