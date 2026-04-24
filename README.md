# Syntactics Skills

Claude Code skills for Syntactics Inc. internal workflow automation.

## Skills

| Skill | Description |
|-------|-------------|
| `ai-content-writer` | Write and optimize web content for Google and AI agents |
| `ba-project-intake` | Entry point for BA project lifecycle — gather and structure requirements |
| `database-administrator` | ERD design, normalization, schema best practices |
| `final-design` | Produce Final Design Documents (FDD) for web/mobile projects |
| `sprint-planner` | Convert approved DB schema into development task list |

## Install (one-time per machine)

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

**Mac/Linux:**
```bash
bash scripts/install.sh
```

What the install script does:
1. Clones this repo to `~/.syntactics-skills/`
2. Deploys skills to `~/.claude/skills/`
3. Adds an auto-update hook to `~/.claude/settings.json`

After install, skills auto-update every 30 minutes while Claude Code is open. No manual steps needed for future updates.

## Development

```bash
npm run dev        # watch + auto-validate + deploy on file change
npm run validate   # validate all skill frontmatter
npm run deploy:local  # manual deploy to ~/.claude/skills/
npm run build      # package skills as dist/*.skill ZIPs
npm run bump       # bump semver for changed skills
```

## Structure

```
skills/
  {skill-name}/
    SKILL.md          # skill definition + frontmatter (name, version, description)
    references/       # supporting templates, question banks, output formats
scripts/
  install.ps1         # Windows one-time install
  install.sh          # Mac/Linux one-time install
  deploy-local.js     # copy skills to ~/.claude/skills/
  validate-skills.js  # frontmatter + semver validation
  build-skills.js     # package skills as ZIPs
  watch.js            # dev file watcher
  bump-version.js     # auto-bump semver on git diff
```

## CI/CD

On merge to `main`: validate → bump patch version → build ZIPs → create GitHub Release.
