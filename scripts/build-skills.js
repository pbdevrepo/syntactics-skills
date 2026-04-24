#!/usr/bin/env node
// Packages each skill directory into a .skill ZIP file in dist/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const DIST_DIR = path.join(__dirname, '..', 'dist');

fs.mkdirSync(DIST_DIR, { recursive: true });

const skills = fs.readdirSync(SKILLS_DIR).filter(d =>
  fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

console.log(`Building ${skills.length} skills → dist/\n`);

for (const skill of skills) {
  const zipName = `${skill}.skill`;
  const zipPath = path.join(DIST_DIR, zipName);
  try {
    execFileSync('zip', ['-r', zipPath, `${skill}/`], { cwd: SKILLS_DIR, stdio: 'pipe' });
    console.log(`  built: dist/${zipName}`);
  } catch (err) {
    console.error(`  failed: ${skill} — ${err.message}`);
  }
}

console.log('\nBuild complete.');
