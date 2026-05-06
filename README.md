# Syntactics Skills

Claude Code skills for Syntactics Inc. internal workflow automation.

## Workflows

### Sales (`sales-workflow`)
| Skill | Description |
|-------|-------------|
| `requirement-analyzer` | Extract and structure client requirements from PDF or free-form text |
| `proposal-grill` | Stress-test requirements for missed modules and ambiguous scope |
| `proposal-writer` | Write a client-facing project proposal |
| `quotation` | Generate itemized module/feature list with placeholder hour ranges per role |

### Business Analysis (`ba-workflow`)
| Skill | Description |
|-------|-------------|
| `ba-project-intake` | Entry point — gather and structure requirements from proposal |
| `database-administrator` | ERD design, normalization, schema best practices |
| `sprint-planner` | Convert approved DB schema into development task list |
| `final-design` | Produce Final Design Documents (FDD) per module |

### Design & Development (`design-dev-workflow`)
| Skill | Description |
|-------|-------------|
| `ui-designer` | Generate Figma design task list from FDD wireframe specs |
| `frontend-developer` | Generate frontend implementation task list from FDD + design tasks |
| `backend-developer` | Generate backend implementation task list from FDD + frontend tasks |
| `qa-tester` | Generate test cases mapped to FDD validation rules and implemented tasks |
| `bug-fixer` | Generate prioritized fix task list from failed QA test cases |

### Content (`content-workflow`)
| Skill | Description |
|-------|-------------|
| `ai-content-writer` | Write and optimize web content for Google and AI agents |

## Workflow Sequence

```
Sales:  requirement-analyzer → proposal-grill → proposal-writer → quotation
                                                                       ↓ (client approves)
BA:     ba-project-intake → database-administrator → sprint-planner → final-design
                                                                       ↓ (FDD approved)
D&D:    ui-designer → frontend-developer → backend-developer → qa-tester ⇄ bug-fixer
```

Artifacts are written to `output/{project-name}/{workflow-phase}/{artifact}.md`.

## Install (one-command)

```bash
npx syntactics-skills@latest add syntactics-skills/skills
```

This downloads the latest skills from GitHub releases and installs them to `~/.claude/skills/`. Restart Claude Code to load the skills.

## Legacy Install (deprecated)

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install.ps1
```

**Mac/Linux:**
```bash
bash scripts/install.sh
```

These clone the repo locally and set up auto-updates. The npx command above is preferred for new installations.

## Development

Skills are developed directly in the `skills/` directory. Changes are automatically built and released via GitHub Actions when merged to `main`.

To test locally during development:
1. Edit skills in `skills/{workflow}/{skill}/SKILL.md`
2. Push to `main` branch
3. CI builds `.skill` ZIPs and creates a GitHub release
4. Run `npx syntactics-skills@latest add syntactics-skills/skills` to install the latest version

## Structure

```
skills/
  {workflow}-workflow/
    {skill-name}/
      SKILL.md          # skill definition + frontmatter (name, version, description)
      references/       # supporting templates, question banks, output formats
bin/
  cli.js               # CLI tool for installing skills from GitHub releases
.github/workflows/
  sync-skills.yml      # CI: builds .skill ZIPs and creates releases
```

## CI/CD

On merge to `main`: build `.skill` ZIPs → create GitHub Release with skill assets.
