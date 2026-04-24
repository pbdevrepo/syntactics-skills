#!/usr/bin/env node
// Bundles pre-built .skill files into per-workflow ZIPs.
// Must run after build-skills.js.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const DIST_DIR = path.join(__dirname, '..', 'dist');

function isDir(p) { return fs.statSync(p).isDirectory(); }

const workflows = fs.readdirSync(SKILLS_DIR)
  .filter(d => d.endsWith('-workflow') && isDir(path.join(SKILLS_DIR, d)));

if (workflows.length === 0) {
  console.log('No *-workflow directories found.');
  process.exit(0);
}

console.log(`Building ${workflows.length} workflow bundles → dist/\n`);

for (const workflow of workflows) {
  const skills = fs.readdirSync(path.join(SKILLS_DIR, workflow))
    .filter(s => isDir(path.join(SKILLS_DIR, workflow, s)));

  const skillFiles = skills.map(s => `${s}.skill`).filter(f =>
    fs.existsSync(path.join(DIST_DIR, f))
  );

  if (skillFiles.length === 0) {
    console.warn(`  skip: ${workflow} — no built .skill files found`);
    continue;
  }

  const zipPath = path.join(DIST_DIR, `${workflow}.zip`);
  try {
    execFileSync('zip', [zipPath, ...skillFiles], { cwd: DIST_DIR, stdio: 'pipe' });
    console.log(`  built: dist/${workflow}.zip  [${skillFiles.join(', ')}]`);
  } catch (err) {
    console.error(`  failed: ${workflow} — ${err.message}`);
  }
}

console.log('\nWorkflow bundles complete.');
