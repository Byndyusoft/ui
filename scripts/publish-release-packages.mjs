import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
assert.ok(
    process.argv.slice(2).every(arg => arg === '--dry-run'),
    'Only --dry-run is supported'
);
const dryRun = process.argv.includes('--dry-run');
const scope = JSON.parse(readFileSync(new URL('./release-packages.json', import.meta.url), 'utf8'));
const packages = new Map();
for (const group of ['hooks', 'components']) {
    for (const entry of readdirSync(join(root, group), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const manifest = JSON.parse(readFileSync(join(root, group, entry.name, 'package.json'), 'utf8'));
        packages.set(manifest.name, manifest);
    }
}

const selected = new Set(scope.packages.map(pkg => pkg.name));
const ordered = [];
const visited = new Set();
function visit(name) {
    if (visited.has(name)) return;
    visited.add(name);
    for (const dependency of Object.keys(packages.get(name).dependencies ?? {})) {
        if (selected.has(dependency)) visit(dependency);
    }
    ordered.push(name);
}

// Validate every package before the first publication.
for (const { name, previousVersion } of scope.packages) {
    const version = previousVersion.split('.').map(Number);
    version[2] += 1;
    assert.equal(packages.get(name)?.version, version.join('.'), `${name}: apply the release changeset first`);
    visit(name);
}

for (const name of ordered) {
    execFileSync('npm', ['publish', `--workspace=${name}`, '--access=public', ...(dryRun ? ['--dry-run'] : [])], {
        cwd: root,
        stdio: 'inherit'
    });
}
