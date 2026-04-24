#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const DEST_DIR = path.join(os.homedir(), '.claude', 'skills');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const skills = fs.readdirSync(SKILLS_DIR).filter(d =>
  fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

console.log(`Deploying ${skills.length} skills to ${DEST_DIR}\n`);

for (const skill of skills) {
  const src = path.join(SKILLS_DIR, skill);
  const dest = path.join(DEST_DIR, skill);
  copyDir(src, dest);
  console.log(`  deployed: ${skill}`);
}

console.log('\nDone. Restart Claude to pick up changes.');
