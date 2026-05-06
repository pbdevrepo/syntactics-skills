# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run validate        # validate all skill frontmatter + semver
npm run deploy:local    # copy skills (flattened) to ~/.claude/skills/
npm run dev             # watch + auto-validate + deploy on .md change
npm run build           # build individual .skill ZIPs + workflow bundle ZIPs
npm run build:workflows # build only workflow bundles (requires build first)
npm run bump            # bump patch version for git-changed skills
node scripts/bump-version.js minor  # bump minor instead
```

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{workflow}/{skill}/SKILL.md
  → validate-skills.js  → ~/.claude/skills/{skill}/   (flattened, no workflow subdir)
  → build-skills.js     → dist/{skill}.skill
  → build-workflows.js  → dist/{workflow}.zip          (bundles .skill files per role)
```

**Directory structure:**
```
skills/
  {role}-workflow/
    {skill-name}/
      SKILL.md           # required: YAML frontmatter + ## sections
      references/*.md    # optional: templates, question banks, output formats
dist/
  {skill-name}.skill     # individual skill ZIP
  {role}-workflow.zip    # all skills in that workflow bundled together
```

**Frontmatter rules** enforced by `validate-skills.js`:
- `name` must match skill directory name exactly
- `version` must be valid semver
- `description` field drives Claude Code's skill trigger logic
- At least one `##` section required in body

**`discoverSkills()`** — shared pattern used by validate, deploy, build scripts:
scans `skills/*-workflow/` dirs, returns `[{ workflow, skill, skillPath }]`.

**Version bumping** (`bump-version.js`): diffs `origin/main...HEAD`, extracts skill from `skills/{workflow}/{skill}/` path, bumps only changed skills. CI auto-commits with `[skip ci]`.

**CI trigger**: fires only when `skills/**-workflow/**/SKILL.md` or references change.

## Distribution

New machines run one install script (see README). The install wires a `UserPromptSubmit` hook that runs `git pull + deploy-local.js` at most once per 30 minutes via a timestamp file at `~/.syntactics-skills/.last-pull`.

## Adding a Skill

1. Create `skills/{role}-workflow/{skill-name}/SKILL.md` with frontmatter `name`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. `npm run validate` — must pass before committing
4. `npm run deploy:local` to test locally
5. Merge to `main` — CI auto-bumps version and publishes individual `.skill` + workflow `.zip`

## Adding a New Workflow Role

Create a new `skills/{role}-workflow/` directory and add skills inside it. No config changes needed — scripts auto-discover all `*-workflow` directories.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`pbdevrepo/syntactics-skills`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
