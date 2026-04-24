#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const DIST_DIR = path.join(__dirname, '..', 'dist');

function isDir(p) { return fs.statSync(p).isDirectory(); }

function discoverSkills(skillsDir) {
  return fs.readdirSync(skillsDir)
    .filter(d => d.endsWith('-workflow') && isDir(path.join(skillsDir, d)))
    .flatMap(workflow =>
      fs.readdirSync(path.join(skillsDir, workflow))
        .filter(s => isDir(path.join(skillsDir, workflow, s)))
        .map(skill => ({ workflow, skill, skillPath: path.join(skillsDir, workflow, skill) }))
    );
}

fs.mkdirSync(DIST_DIR, { recursive: true });

const skills = discoverSkills(SKILLS_DIR);
console.log(`Building ${skills.length} skills → dist/\n`);

for (const { workflow, skill } of skills) {
  const zipPath = path.join(DIST_DIR, `${skill}.skill`);
  try {
    execFileSync('zip', ['-r', zipPath, `${skill}/`], {
      cwd: path.join(SKILLS_DIR, workflow),
      stdio: 'pipe',
    });
    console.log(`  built: dist/${skill}.skill  [${workflow}]`);
  } catch (err) {
    console.error(`  failed: ${workflow}/${skill} — ${err.message}`);
  }
}

console.log('\nBuild complete.');
