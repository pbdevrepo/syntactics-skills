#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const matter = require('gray-matter');
const semver = require('semver');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const releaseType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(releaseType)) {
  console.error(`Invalid release type: ${releaseType}. Use patch, minor, or major.`);
  process.exit(1);
}

let changedFiles;
try {
  changedFiles = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], {
    cwd: path.join(__dirname, '..'),
  }).toString().trim().split('\n');
} catch {
  changedFiles = [];
}

// paths are now skills/{workflow}/{skill}/...
const changedSkills = new Set(
  changedFiles
    .filter(f => f.startsWith('skills/') && f.split('/')[1]?.endsWith('-workflow'))
    .map(f => ({ workflow: f.split('/')[1], skill: f.split('/')[2] }))
    .filter(({ skill }) => Boolean(skill))
    .map(({ workflow, skill }) => `${workflow}/${skill}`)
);

if (changedSkills.size === 0) {
  console.log('No skill changes detected. Nothing to bump.');
  process.exit(0);
}

for (const entry of changedSkills) {
  const [workflow, skill] = entry.split('/');
  const skillFile = path.join(SKILLS_DIR, workflow, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) continue;

  const raw = fs.readFileSync(skillFile, 'utf8');
  const parsed = matter(raw);
  const current = parsed.data.version || '1.0.0';
  const next = semver.inc(current, releaseType);

  parsed.data.version = next;
  fs.writeFileSync(skillFile, matter.stringify(parsed.content, parsed.data), 'utf8');
  console.log(`  ${workflow}/${skill}: ${current} → ${next}`);
}

console.log('\nVersion bump complete. Stage and commit these changes.');
