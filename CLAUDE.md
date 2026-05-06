# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx syntactics-skills@latest add syntactics-skills/skills  # install skills from GitHub releases
```

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{workflow}/{skill}/SKILL.md
  → GitHub Actions    → dist/{skill}.skill         (individual skill ZIP)
  → GitHub Release    → npx add downloads          (installs to ~/.claude/skills/)
```

**Directory structure:**
```
skills/
  {role}-workflow/
    {skill-name}/
      SKILL.md           # required: YAML frontmatter + ## sections
      references/*.md    # optional: templates, question banks, output formats
dist/
  {skill-name}.skill     # individual skill ZIP (built by CI)
output/
  {project-name}/
    sales/               # artifacts from sales-workflow
    ba/                  # artifacts from ba-workflow
    design-dev/          # artifacts from design-dev-workflow
CONTEXT.md               # canonical domain language for all workflows
```

**Frontmatter rules:**
- `name` must match skill directory name exactly
- `version` must be valid semver
- `description` field drives Claude Code's skill trigger logic
- At least one `##` section required in body

**CI trigger**: fires only when `skills/**-workflow/**/SKILL.md` or references change. Automatically builds `.skill` ZIPs and creates GitHub releases.

## Distribution

Users install skills with one command:
```bash
npx syntactics-skills@latest add syntactics-skills/skills
```

This downloads the latest `.skill` files from GitHub releases and extracts them to `~/.claude/skills/`.

## Adding a Skill

1. Create `skills/{role}-workflow/{skill-name}/SKILL.md` with frontmatter `name`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. Commit and push to `main` — CI automatically builds `.skill` ZIP and creates release
4. Users can install with: `npx syntactics-skills@latest add syntactics-skills/skills`

## Adding a New Workflow Role

Create a new `skills/{role}-workflow/` directory and add skills inside it. No config changes needed — CI auto-discovers all `*-workflow` directories.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`pbdevrepo/syntactics-skills`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
