# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Windows:**
```powershell
irm https://development.websiteprojectupdates.com/wiki/wp-content/uploads/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -fsSL https://development.websiteprojectupdates.com/wiki/wp-content/uploads/install.sh | bash
```

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{workflow}/{skill}/SKILL.md
  → GitHub Actions    → skills ZIP uploaded to WordPress
  → WordPress pointer page updated with ZIP URL
  → install.ps1 / install.sh reads pointer → downloads ZIP → extracts to ~/.claude/skills/
```

**Directory structure:**
```
skills/
  {role}-workflow/
    {skill-name}/
      SKILL.md           # required: YAML frontmatter + ## sections
      references/*.md    # optional: templates, question banks, output formats
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

**CI trigger**: fires only when `skills/**-workflow/**/SKILL.md` or references change. Uploads ZIP to WordPress and updates the pointer page automatically.

## Distribution

Skills are distributed via WordPress. CI uploads the skills ZIP on every release and updates a pointer page with the URL. Install scripts read that page and extract skills to `~/.claude/skills/`.

See `README.md` for one-time distribution setup instructions.

## Adding a Skill

1. Create `skills/{role}-workflow/{skill-name}/SKILL.md` with frontmatter `name`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. Commit and push to `main` — CI uploads the new ZIP to WordPress and updates the pointer page
4. Users run the install command again to get the latest skills

## Adding a New Workflow Role

Create a new `skills/{role}-workflow/` directory and add skills inside it. No config changes needed — CI auto-discovers all `*-workflow` directories.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`pbdevrepo/syntactics-skills`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
