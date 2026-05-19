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

**Install to current project only (local):**

Windows:
```powershell
& ([scriptblock]::Create((irm $url))) -Local -Workflow ba
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --local --workflow ba
```

Use `-Global` / `--global` to explicitly install to `~/.claude/skills/` (this is the default). Omitting both flags shows an interactive location prompt.

> `must-have-workflow` skills (`sync-caveman`, `sync-grill-me`, `sync-grill-with-docs`) are always installed regardless of selection.

## Architecture

Skills are markdown files deployed to `~/.claude/skills/` for Claude Code to load. No runtime server. No database.

**Data flow:**
```
skills/{workflow}/sync-{skill}/SKILL.md
  → install.ps1 / install.sh downloads main branch ZIP from GitHub → discovers workflows from dir structure
  → copies selected skill dirs to ~/.claude/skills/sync-{skill}/
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
    pm/                  # artifacts from pm-workflow
CONTEXT.md               # canonical domain language for all workflows
```

**Frontmatter rules:**
- `name` must match skill directory name exactly (e.g. dir `sync-ba-project-intake` → `name: sync-ba-project-intake`)
- all skill names must use `sync-` prefix
- `version` must be valid semver
- `description` field drives Claude Code's skill trigger logic
- At least one `##` section required in body

## Distribution

Skills are distributed directly from the `main` branch. Install scripts download the GitHub archive ZIP (`/archive/refs/heads/main.zip`), discover workflows from the `skills/*-workflow/` directory structure, and copy only the selected skills to `~/.claude/skills/`. No CI or manifest file required.

## Updating Docs After Any Change

After adding, modifying, or removing any skill or reference file, always update these three files:

- **CHANGELOG.md** — add an entry under `[Unreleased] - {today's date}` (create the block if it doesn't exist). Use `### Added`, `### Changed`, or `### Removed` as appropriate. One bullet per skill or reference file changed.
- **README.md** — update the relevant workflow skill table and the Workflow Sequence diagram if the skill is new, renamed, removed, or its description changed.
- **CONTEXT.md** — update the Sales/BA/Design/Engineering workflow terms and the Workflow Sequence diagram if new artifact types, term definitions, or workflow relationships were introduced.

Only update a file if the change is relevant to it. A description tweak does not need a CONTEXT.md entry. A new skill always needs all three.

---

## Adding a Skill

1. Create `skills/{role}-workflow/sync-{skill-name}/SKILL.md` with frontmatter `name: sync-{skill-name}`, `version: 1.0.0`, `description`
2. Add at least one `##` section
3. Commit and push to `main`
4. Users run the install command again to get the latest skills

## Adding a New Workflow Role

Create a new `skills/{role}-workflow/` directory and add skills inside it. No config changes needed — install scripts auto-discover all `*-workflow` directories.

## Output Formatting

All skills apply this rule globally. Do not add per-skill `## Output Formatting` sections — the rule here covers all skills.

- Never use em dashes (--) in any generated `.md` output. Use a hyphen (-) instead.

### Project Setup — Copy This Block

When setting up a new client project, copy this block into the client project's `CLAUDE.md` before running any skills. Skills no longer carry individual Output Formatting sections — this rule must exist in the project where output is generated.

```md
## Output Formatting

- Never use em dashes (--) in any generated `.md` output. Use a hyphen (-) instead.
```

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`pbdevrepo/syntactics-skills`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
