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
const fixture = mkdtempSync(join(tmpdir(), 'byndyusoft-hook-packages-'));
const packages = new Map();
const hooks = [];
const components = [];

for (const group of ['hooks', 'services', 'packages', 'components']) {
    for (const entry of readdirSync(join(root, group), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const directory = join(root, group, entry.name);
        if (!existsSync(join(directory, 'package.json'))) continue;
        const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
        packages.set(manifest.name, { directory, manifest });
        if (manifest.type === 'commonjs') {
            if (group === 'hooks') hooks.push(manifest.name);
            if (group === 'components') components.push(manifest.name);
        }
    }
}

const packed = new Set();
const targets = new Set([...hooks, ...components]);

function pack(name) {
    if (packed.has(name)) return;
    const { directory, manifest } = packages.get(name);
    const packResult = JSON.parse(
        execFileSync(
            'npm',
            [
                'pack',
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

    if (targets.has(name)) {
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
    assert.ok(targets.size > 0, 'No CommonJS hooks or components found');
    execFileSync(
        process.execPath,
        [join(root, 'node_modules', 'turbo', 'bin', 'turbo'), 'run', 'build', ...[...targets].map(name => `--filter=${name}`)],
        { cwd: root, stdio: 'inherit' }
    );
    for (const name of targets) pack(name);
    // Share only the consumer's React and test tools. Library packages come from npm archives.
    for (const name of ['react', 'react-dom', 'jsdom', '@testing-library/react-hooks', 'typescript', '@types/react']) {
        const destination = join(fixture, 'node_modules', name);
        mkdirSync(dirname(destination), { recursive: true });
        symlinkSync(join(root, 'node_modules', name), destination, 'dir');
    }
    writeFileSync(join(fixture, 'packages.json'), JSON.stringify({ hooks, components }));
    // Verify the user's dependency chain with Node's native ESM loader, before setting up a DOM.
    execFileSync(
        process.execPath,
        [
            '--input-type=module',
            '--eval',
            `import assert from 'node:assert/strict';
             import { createRequire } from 'node:module';
             const require = createRequire(import.meta.url);
             for (const name of ${JSON.stringify([...targets])}) {
                 const module = await import(name);
                 assert.equal(module.default, require(name), name);
             }`
        ],
        { cwd: fixture, stdio: 'inherit' }
    );
    cpSync(join(root, 'scripts', 'fixtures', 'hook-packages.tests.mjs'), join(fixture, 'hook-packages.tests.mjs'));
    execFileSync(process.execPath, ['--test', join(fixture, 'hook-packages.tests.mjs')], { stdio: 'inherit' });
} finally {
    rmSync(fixture, { recursive: true, force: true });
}
