#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

function usage() {
  console.log('Usage: npx syntactics-skills@latest add <owner/repo>');
  console.log('  Example: npx syntactics-skills@latest add syntactics-skills/skills');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    opts.headers = { 'User-Agent': 'syntactics-skills-cli', Accept: 'application/vnd.github+json' };
    https.get(opts, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  const { status, body } = await get(url);
  if (status !== 200) throw new Error(`Download failed (${status}): ${url}`);
  fs.writeFileSync(dest, body);
}

async function main() {
  const [, , command, repo] = process.argv;

  if (command !== 'add') usage();
  if (!repo || !repo.includes('/')) usage();

  const [owner, repoName] = repo.split('/');
  console.log(`\nFetching latest release from ${owner}/${repoName}...`);

  const { status, body } = await get(
    `https://api.github.com/repos/${owner}/${repoName}/releases/latest`
  );

  if (status === 404) {
    console.error(`Repo not found or no releases yet: ${owner}/${repoName}`);
    process.exit(1);
  }
  if (status !== 200) {
    console.error(`GitHub API error (${status})`);
    process.exit(1);
  }

  const release = JSON.parse(body.toString());
  const skillAssets = (release.assets || []).filter((a) => a.name.endsWith('.skill'));

  if (skillAssets.length === 0) {
    console.error('No .skill files found in the latest release.');
    process.exit(1);
  }

  fs.mkdirSync(SKILLS_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntactics-skills-'));

  let installed = 0;

  for (const asset of skillAssets) {
    const skillZip = path.join(tmpDir, asset.name);
    const skillName = asset.name.replace('.skill', '');

    process.stdout.write(`  ${skillName}: downloading...`);
    await downloadFile(asset.browser_download_url, skillZip);
    process.stdout.write(' extracting...');

    const skillExtract = path.join(tmpDir, `skill-${skillName}`);
    fs.mkdirSync(skillExtract, { recursive: true });
    execFileSync('unzip', ['-q', '-o', skillZip, '-d', skillExtract]);

    // .skill ZIP contains: skillname/SKILL.md, skillname/references/, etc.
    const innerDirs = fs.readdirSync(skillExtract);
    const inner = innerDirs.length === 1 ? path.join(skillExtract, innerDirs[0]) : skillExtract;
    const skillDest = path.join(SKILLS_DIR, skillName);

    if (fs.existsSync(skillDest)) fs.rmSync(skillDest, { recursive: true });
    fs.renameSync(inner, skillDest);

    process.stdout.write(' done\n');
    installed++;
  }

  // cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\n✓ ${installed} skill(s) installed to ${SKILLS_DIR}`);
  console.log('Restart Claude to load the skills.');
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
      fs.cpSync(inner, skillDest, { recursive: true });
      installed++;
    }
    console.log(' done');
