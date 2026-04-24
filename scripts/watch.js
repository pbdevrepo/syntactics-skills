#!/usr/bin/env node
const chokidar = require('chokidar');
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');

console.log('Watching skills/**/*.md — validate + deploy on change\n');

const watcher = chokidar.watch(path.join(ROOT, 'skills', '**', '*.md'), {
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 200 },
});

function sync(filePath) {
  const rel = path.relative(ROOT, filePath);
  console.log(`\nChanged: ${rel}`);
  try {
    execFileSync('node', ['scripts/validate-skills.js'], { cwd: ROOT, stdio: 'inherit' });
    execFileSync('node', ['scripts/deploy-local.js'], { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error('Sync failed — fix errors above before retrying.');
  }
}

watcher.on('change', sync);
watcher.on('add', sync);
