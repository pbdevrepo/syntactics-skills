#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const semver = require('semver');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const REQUIRED_FRONTMATTER = ['name', 'description', 'version'];

let errors = 0;

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

function error(skill, msg) { console.error(`[FAIL] ${skill}: ${msg}`); errors++; }
function pass(skill, msg)  { console.log(`[OK]   ${skill}: ${msg}`); }

const skills = discoverSkills(SKILLS_DIR);

if (skills.length === 0) {
  console.error('No skills found. Ensure skills live under *-workflow/ subdirectories.');
  process.exit(1);
}

for (const { workflow, skill, skillPath } of skills) {
  const skillFile = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    error(`${workflow}/${skill}`, 'SKILL.md missing');
    continue;
  }

  const { data, content } = matter(fs.readFileSync(skillFile, 'utf8'));

  for (const field of REQUIRED_FRONTMATTER) {
    if (!data[field]) error(`${workflow}/${skill}`, `missing frontmatter field: ${field}`);
  }
  if (data.version && !semver.valid(data.version)) {
    error(`${workflow}/${skill}`, `invalid semver: ${data.version}`);
  }
  if (data.name && data.name !== skill) {
    error(`${workflow}/${skill}`, `name "${data.name}" does not match directory "${skill}"`);
  }
  if (!content.includes('##')) {
    error(`${workflow}/${skill}`, 'missing ## section');
  }
  if (errors === 0) {
    pass(`${workflow}/${skill}`, `v${data.version} — valid`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found. Fix before deploying.`);
  process.exit(1);
} else {
  console.log(`\nAll ${skills.length} skills valid.`);
}
