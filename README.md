# Syntactics Skills

Claude Code skills for Syntactics Inc. internal workflow automation.

## Team Setup

New team member? Follow these steps once to get skills running on your machine.

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Claude Code](https://claude.ai/code) | Desktop app or CLI — must be installed and logged in |
| PowerShell (Windows) or Terminal (Mac/Linux) | Built-in on all supported OS |
| Internet access | Install script pulls from GitHub |

> No Git, Node, or Python required. The install script has no dependencies.

### Steps

![Open a terminal](assets/img/open-powershell.png)

**1. Open a terminal**

- Windows: open **PowerShell** (not CMD)
- Mac/Linux: open **Terminal**

**2. Run the install script**

![Open a terminal](assets/img/paste-script.png)

Windows:
```powershell
irm https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1 | iex
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash
```

**3. Choose install location**

![Open a terminal](assets/img/running-script.png)

Select **Global** (installs to `~/.claude/skills/`) — skills available in all projects.

**4. Select your workflows**

Pick the workflows matching your role:

| Role | Workflow(s) to select |
|------|-----------------------|
| Sales | `sales` |
| Business Analyst | `ba` |
| Designer | `design-dev` |
| Frontend / Backend Developer | `design-dev` |
| QA Tester | `design-dev` |
| Content Writer | `content` |
| All roles | Select all |

> `must-have` (caveman, grill-me, grill-with-docs) installs automatically.

**5. Restart Claude Code**

Close and reopen Claude Code (desktop app) or restart your CLI session.

**6. Verify**

In any Claude Code session, type:
```
/sync-caveman
```
Claude should respond in compressed mode. Skills are working.

### Updating Skills

Re-run the same install command from Step 2. The script overwrites existing skills with the latest from `main`.

### Advanced: Non-Interactive Install

Skip prompts by passing flags directly.

Windows:
```powershell
$url = "https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1"
& ([scriptblock]::Create((irm $url))) -Global -Workflow sales,ba   # specific workflows
& ([scriptblock]::Create((irm $url))) -Local -Workflow ba          # local project only
& ([scriptblock]::Create((irm $url))) -Skill sync-requirement-analyzer,sync-proposal-writer  # specific skills
```

Mac/Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --global --workflow sales --workflow ba
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --local --workflow ba
curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --skill sync-requirement-analyzer --skill sync-proposal-writer
```

| Flag | Effect |
|------|--------|
| `-Global` / `--global` | Install to `~/.claude/skills/` (all projects) |
| `-Local` / `--local` | Install to `./.claude/skills/` (current project only) |
| `-Workflow` / `--workflow` | Select specific workflow(s) |
| `-Skill` / `--skill` | Select specific skill(s) |

---

## Workflows

### Sales (`sales-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-client-discovery` | Generate structured discovery questions for clients with no brief or clear direction |
| `sync-requirement-analyzer` | Extract and structure client requirements from PDF or free-form text |
| `sync-proposal-grill` | Stress-test requirements for missed modules and ambiguous scope |
| `sync-proposal-writer` | Write a client-facing project proposal |
| `sync-quotation` | Generate itemized module/feature list with placeholder hour ranges per role |

### Business Analysis (`ba-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-ba-project-intake` | Entry point — gather and structure requirements from proposal |
| `sync-database-administrator` | ERD design, normalization, schema best practices |
| `sync-sprint-planner` | Convert approved DB schema into development task list |
| `sync-final-design` | Produce Final Design Documents (FDD) per module |

### Design & Development (`design-dev-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-ui-designer` | Generate Figma design task list from FDD wireframe specs |
| `sync-frontend-developer` | Generate frontend implementation task list from FDD + design tasks |
| `sync-backend-developer` | Generate backend implementation task list from FDD + frontend tasks |
| `sync-qa-tester` | Generate test cases mapped to FDD validation rules and implemented tasks |
| `sync-bug-fixer` | Generate prioritized fix task list from failed QA test cases |

### Must-Have (`must-have-workflow`)

Always installed regardless of workflow selection.

| Skill | Description |
|-------|-------------|
| `sync-caveman` | Ultra-compressed communication mode — cuts token usage ~75% |
| `sync-grill-me` | Interview the user relentlessly about a plan or design until reaching shared understanding |
| `sync-grill-with-docs` | Grilling session that challenges a plan against the existing domain model and updates docs inline |

### Content (`content-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-ai-content-writer` | Write and optimize web content for Google and AI agents |

## Workflow Sequence

```
Sales:  sync-client-discovery → sync-requirement-analyzer → sync-proposal-grill → sync-proposal-writer → sync-quotation
                                                                                       ↓ (client approves)
BA:     sync-ba-project-intake → sync-database-administrator → sync-sprint-planner → sync-final-design
                                                                                       ↓ (FDD approved)
D&D:    sync-ui-designer → sync-frontend-developer → sync-backend-developer → sync-qa-tester ⇄ sync-bug-fixer
```

Artifacts are written to `projects/{project-name}/{workflow-phase}/{artifact}.md`.

## Development

Skills are developed directly in the `skills/` directory. Push to `main` — the install scripts download the latest from `main` automatically. No CI required.

To test a change:
1. Edit skills in `skills/{workflow}/{skill}/SKILL.md`
2. Push to `main`
3. Run the install command above to get the latest version

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
```
