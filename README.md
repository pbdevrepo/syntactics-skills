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

## Install

Copy and run the command for your OS. No prerequisites required.

**Windows** — paste into PowerShell:
```powershell
irm https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1 | iex
```

**Mac/Linux** — paste into Terminal:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash
```

Restart Claude Code after the script completes.

To update skills, run the same command again.

## Development

Skills are developed directly in the `skills/` directory. Push to `main` — CI creates a GitHub Release with the skills ZIP automatically.

To test locally:
1. Edit skills in `skills/{workflow}/{skill}/SKILL.md`
2. Push to `main`
3. CI creates a new GitHub Release with the updated ZIP
4. Run the install command above to get the latest version

## Structure

```
skills/
  {workflow}-workflow/
    {skill-name}/
      SKILL.md          # skill definition + frontmatter (name, version, description)
      references/       # supporting templates, question banks, output formats
scripts/
  install.ps1           # Windows install script
  install.sh            # Mac/Linux install script
.github/workflows/
  sync-skills.yml       # CI: creates ZIP, publishes GitHub Release
```

## CI/CD

On push to `main` when skill files change: creates a skills ZIP and publishes a GitHub Release tagged with the timestamp. The release asset `syntactics-skills.zip` is downloaded by the install scripts. No setup required — uses the built-in `GITHUB_TOKEN`.
