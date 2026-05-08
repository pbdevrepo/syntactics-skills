# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Install all skills (interactive menu on first run):**

Windows:
```powershell
irm https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1 | iex
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash
```

**Install specific workflows (no menu):**

Windows — use the scriptblock form to pass parameters:
```powershell
$url = "https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1"
& ([scriptblock]::Create((irm $url))) -Workflow sales,ba
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --workflow sales --workflow ba
```

**Install specific skills:**

Windows:
```powershell
& ([scriptblock]::Create((irm $url))) -Skill sync-requirement-analyzer,sync-proposal-writer
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --skill sync-requirement-analyzer --skill sync-proposal-writer
```

> `must-have-workflow` skills (`sync-caveman`, `sync-grill-me`, `sync-grill-with-docs`) are always installed regardless of selection.

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{workflow}/sync-{skill}/SKILL.md
  → GitHub Actions    → CI flattens workflow dirs → skills ZIP published as GitHub Release asset
  → install.ps1 / install.sh downloads latest release ZIP → extracts flat to ~/.claude/skills/sync-{skill}/
```

**Directory structure:**
```
skills/
  {role}-workflow/
    sync-{skill-name}/
      SKILL.md           # required: YAML frontmatter + ## sections
      references/*.md    # optional: templates, question banks, output formats
projects/
  {project-name}/
    sales/               # artifacts from sales-workflow
    ba/                  # artifacts from ba-workflow
    design-dev/          # artifacts from design-dev-workflow
CONTEXT.md               # canonical domain language for all workflows
```

**Frontmatter rules:**
- `name` must match skill directory name exactly (e.g. dir `sync-ba-project-intake` → `name: sync-ba-project-intake`)
- all skill names must use `sync-` prefix
- `version` must be valid semver
- `description` field drives Claude Code's skill trigger logic
- At least one `##` section required in body

**CI trigger**: fires only when `skills/**-workflow/**/SKILL.md` or references change. Creates a GitHub Release with `syntactics-skills.zip` as the asset.

## Distribution

Skills are distributed via GitHub Releases. CI creates a new release on every skill change. The ZIP contains all flat `sync-*` skill dirs plus a `manifest.json` that maps workflow names to their skill lists. Install scripts download the ZIP, read the manifest, and copy only the selected skills to `~/.claude/skills/`. No setup required — uses `GITHUB_TOKEN`.

## Adding a Skill

1. Create `skills/{role}-workflow/sync-{skill-name}/SKILL.md` with frontmatter `name: sync-{skill-name}`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. Commit and push to `main` — CI flattens all skill dirs and creates a new GitHub Release automatically
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
