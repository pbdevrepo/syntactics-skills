# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run validate      # validate all skill frontmatter + semver
npm run deploy:local  # copy skills to ~/.claude/skills/
npm run dev           # watch + auto-validate + deploy on .md change
npm run build         # package skills as dist/*.skill ZIPs
npm run bump          # bump patch version for git-changed skills
node scripts/bump-version.js minor  # bump minor instead
```

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{name}/SKILL.md  →  validate  →  deploy-local.js  →  ~/.claude/skills/{name}/
                                      →  build-skills.js  →  dist/{name}.skill (ZIP)
```

**Skill structure** — each skill is a directory:
```
skills/{name}/
  SKILL.md           # required: YAML frontmatter (name, version, description) + ## sections
  references/*.md    # optional: templates, question banks, output formats
```

**Frontmatter rules** enforced by `validate-skills.js`:
- `name` must match directory name exactly
- `version` must be valid semver
- `description` field drives Claude Code's skill trigger logic
- At least one `##` section required in body

**Version bumping** (`bump-version.js`): diffs `origin/main...HEAD`, bumps only skills with changed files. CI auto-commits the bump with `[skip ci]` to avoid loops.

**CI trigger**: only fires when `skills/**/SKILL.md` or `skills/**/references/**` changes. Script changes do not trigger CI.

## Distribution

New machines run one install script (see README). The install wires a `UserPromptSubmit` hook that runs `git pull + deploy-local.js` at most once per 30 minutes via a timestamp file at `~/.syntactics-skills/.last-pull`.

## Adding a Skill

1. Create `skills/{name}/SKILL.md` with frontmatter `name`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. Run `npm run validate` — must pass before committing
4. Run `npm run deploy:local` to test locally
5. Merge to `main` — CI auto-bumps version and publishes release
