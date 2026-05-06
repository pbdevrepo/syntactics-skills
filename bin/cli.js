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
  console.log('  Example: npx syntactics-skills@latest add pbdevrepo/syntactics-skills');
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
  const sourceZipAsset = (release.assets || []).find((a) => a.name.endsWith('.zip') && a.name.includes('syntactics-skills'));

  if (!sourceZipAsset) {
    console.error('No source code ZIP found in the latest release.');
    process.exit(1);
  }

  fs.mkdirSync(SKILLS_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntactics-skills-'));

  let installed = 0;

  // Download and extract the source code ZIP
  const sourceZip = path.join(tmpDir, sourceZipAsset.name);
  process.stdout.write(`Downloading ${sourceZipAsset.name}...`);
  await downloadFile(sourceZipAsset.browser_download_url, sourceZip);
  process.stdout.write(' extracting...');

  const extractDir = path.join(tmpDir, 'extracted');
  fs.mkdirSync(extractDir, { recursive: true });
  execFileSync('unzip', ['-q', '-o', sourceZip, '-d', extractDir]);

  // Find the skills directory in the extracted source
  const repoDir = fs.readdirSync(extractDir).find(dir => dir.includes('syntactics-skills'));
  const skillsSourceDir = path.join(extractDir, repoDir || '', 'skills');

  if (!fs.existsSync(skillsSourceDir)) {
    console.error('Skills directory not found in source code.');
    process.exit(1);
  }

  // Copy all skills to ~/.claude/skills/
  const skillDirs = fs.readdirSync(skillsSourceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const skillDir of skillDirs) {
    const sourcePath = path.join(skillsSourceDir, skillDir);
    const destPath = path.join(SKILLS_DIR, skillDir);

    if (fs.existsSync(destPath)) fs.rmSync(destPath, { recursive: true });
    fs.cpSync(sourcePath, destPath, { recursive: true });
    process.stdout.write(`\n  ${skillDir}: installed`);
    installed++;
  }

  // cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\n\n✓ ${installed} skill(s) installed to ${SKILLS_DIR}`);
  console.log('Restart Claude to load the skills.');
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
