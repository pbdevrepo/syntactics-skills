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
