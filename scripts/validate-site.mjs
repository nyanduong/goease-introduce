import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve('dist');
const files = await readdir(root);
for (const file of files.filter(name => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `Syntax check failed: ${file}`);
}
console.log('JavaScript syntax checks passed.');
if (process.argv.includes('--syntax-only')) process.exit(0);
let checked = 0;
for (const file of files.filter(name => name.endsWith('.html'))) {
  const html = await readFile(resolve(root, file), 'utf8');
  const references = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
  for (const match of html.matchAll(/srcset=["']([^"']+)["']/g)) references.push(...match[1].split(',').map(value => value.trim().split(/\s+/)[0]));
  for (const ref of references) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
    if (ref.startsWith('/')) throw new Error(`Root-relative asset breaks project Pages URL: ${ref}`);
    await access(resolve(dirname(resolve(root, file)), ref.split(/[?#]/)[0]));
    checked += 1;
  }
}
for (const name of ['ha-long','hoi-an','sa-pa','da-lat']) {
  for (const width of [480,960,1280]) await access(resolve(root, 'assets', `${name}-${width}.webp`));
}
const html = await readFile(resolve(root, 'index.html'), 'utf8');
if (!html.includes('GoEase') || !html.includes('Just go.')) throw new Error('Brand invariant missing.');
if ((html.match(/<iframe\b/g) || []).length !== 1) throw new Error('Expected exactly one Facebook iframe.');
if ((html.match(/<dialog\b/g) || []).length !== 1) throw new Error('Expected exactly one download modal.');
console.log(`Static production artifact ready in dist: ${checked} local references verified. No bundling is needed.`);
