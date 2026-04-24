#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const semver = require('semver');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const REQUIRED_FRONTMATTER = ['name', 'description', 'version'];
const REQUIRED_SECTIONS = ['##'];

let errors = 0;

function error(skill, msg) {
  console.error(`[FAIL] ${skill}: ${msg}`);
  errors++;
}

function pass(skill, msg) {
  console.log(`[OK]   ${skill}: ${msg}`);
}

const skills = fs.readdirSync(SKILLS_DIR).filter(d =>
  fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

if (skills.length === 0) {
  console.error('No skills found in skills/');
  process.exit(1);
}

for (const skill of skills) {
  const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    error(skill, 'SKILL.md missing');
    continue;
  }

  const raw = fs.readFileSync(skillPath, 'utf8');
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FRONTMATTER) {
    if (!data[field]) {
      error(skill, `missing frontmatter field: ${field}`);
    }
  }

  if (data.version && !semver.valid(data.version)) {
    error(skill, `invalid semver: ${data.version}`);
  }

  if (data.name && data.name !== skill) {
    error(skill, `name "${data.name}" does not match directory "${skill}"`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      error(skill, `missing section: ${section}`);
    }
  }

  if (errors === 0) {
    pass(skill, `v${data.version} — valid`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found. Fix before deploying.`);
  process.exit(1);
} else {
  console.log(`\nAll ${skills.length} skills valid.`);
}
