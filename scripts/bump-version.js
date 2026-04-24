#!/usr/bin/env node
// Reads git diff to find changed skills, bumps patch version in SKILL.md frontmatter.
// Usage: node scripts/bump-version.js [patch|minor|major] (default: patch)
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

// Find skills changed vs origin/main
let changedFiles;
try {
  changedFiles = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], {
    cwd: path.join(__dirname, '..'),
  }).toString().trim().split('\n');
} catch {
  changedFiles = [];
}

const changedSkills = new Set(
  changedFiles
    .filter(f => f.startsWith('skills/'))
    .map(f => f.split('/')[1])
    .filter(Boolean)
);

if (changedSkills.size === 0) {
  console.log('No skill changes detected. Nothing to bump.');
  process.exit(0);
}

for (const skill of changedSkills) {
  const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
  if (!fs.existsSync(skillPath)) continue;

  const raw = fs.readFileSync(skillPath, 'utf8');
  const parsed = matter(raw);
  const current = parsed.data.version || '1.0.0';
  const next = semver.inc(current, releaseType);

  parsed.data.version = next;

  const updated = matter.stringify(parsed.content, parsed.data);
  fs.writeFileSync(skillPath, updated, 'utf8');
  console.log(`  ${skill}: ${current} → ${next}`);
}

console.log('\nVersion bump complete. Stage and commit these changes.');
