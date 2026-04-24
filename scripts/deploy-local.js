#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const DEST_DIR = path.join(os.homedir(), '.claude', 'skills');

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

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

const skills = discoverSkills(SKILLS_DIR);
console.log(`Deploying ${skills.length} skills to ${DEST_DIR}\n`);

for (const { workflow, skill, skillPath } of skills) {
  copyDir(skillPath, path.join(DEST_DIR, skill));
  console.log(`  deployed: ${workflow}/${skill}`);
}

console.log('\nDone. Restart Claude to pick up changes.');
