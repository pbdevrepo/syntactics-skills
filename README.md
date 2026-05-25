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
| Designer | `pm` |
| Frontend / Backend Developer | `pm`, `engineering` |
| QA Tester | `qa` |
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
| `sync-proposal-writer` | Write a client-facing project proposal with automatic version numbering |
| `sync-proposal-revision` | Apply client feedback to produce a new versioned requirements file and revised proposal |
| `sync-quotation` | Generate itemized module/feature list with placeholder hour ranges per role |

### Business Analysis (`ba-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-ba-project-intake` | Entry point — gather and structure requirements from proposal |
| `sync-database-designer` | ERD design, normalization, schema best practices |
| `sync-sprint-planner` | Convert approved DB schema into development task list |
| `sync-final-design` | Produce Final Design Documents (FDD) — outputs `docs/fdd/index.md` (General Instructions, Figma link, module directory) plus one `docs/fdd/{module-slug}.md` per module |

### PM (`pm-workflow`)
| Skill / Agent | Description |
|---------------|-------------|
| `pm-task-orchestrator` (agent) | Orchestrates full task pipeline from FDD - Stage 1 generates backend tasks and UI design tasks in parallel (both from FDD directly), Stage 2 generates frontend tasks from both Stage 1 outputs; no TBD endpoints |
| `sync-design-to-stories` | Analyzes design mockup images (PNG/JPG/PDF) and generates structured user stories and acceptance criteria per page with MP/US/AC IDs - standalone, no workflow dependencies |
| `sync-ui-task-creator` | Generates sprint-aware Figma design task list from FDD + sprint plan (Stage 1 - parallel with backend) |
| `sync-frontend-task-creator` | Generates sprint-aware frontend task list from FDD + design tasks + backend tasks + sprint plan (Stage 2 - all endpoints named) |
| `sync-backend-task-creator` | Generates sprint-aware backend task list from FDD + database schema + sprint plan (Stage 1 - parallel with UI design) |

### Engineering (`engineering-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-dev-setup` | One-time per-repo setup - scaffolds `## Agent skills` block and `docs/agents/` files so engineering skills know the issue tracker, triage labels, and domain doc layout |
| `sync-dev-session` | Task-level grilling session anchored to FDD - invoked as `/sync-dev-session BE-0001 users-module @tasks.md @fdd.md`; session type auto-derived |
| `sync-dev-tdd` | TDD red-green-refactor loop per task or module; auto-loads prior session summary if found; standalone mode reads task list + FDD directly |
| `sync-dev-to-fix` | TDD-driven bug fix loop from a GitHub issue - fetches, fixes, posts result |
| `sync-dev-diagnose` | Disciplined diagnosis loop for hard bugs and performance regressions - reproduce, minimise, hypothesise, instrument, fix, regression-test |
| `sync-improve-codebase-architecture` | Find deepening opportunities in a codebase informed by CONTEXT.md and ADRs - refactoring, module consolidation, testability improvements |
| `sync-grill-with-docs` | Grilling session that challenges a plan against the existing domain model and updates CONTEXT.md and ADRs inline as decisions crystallise |

### QA (`qa-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-qa-planner` | Generate structured QA test plan from split FDD module files (`docs/fdd/{module-slug}.md`), one module at a time. Accepts optional module filter: `/sync-qa-planner user-management invoicing` |
| `sync-qa-runner` | Execute test plan live via Playwright MCP and HTTP - marks PASS/FAIL, generates regression specs |
| `sync-qa-to-ticket` | Convert QA failures into GitHub issues with labels and FDD references |

### Must-Have (`must-have-workflow`)

Always installed regardless of workflow selection.

| Skill | Description |
|-------|-------------|
| `sync-caveman` | Ultra-compressed communication mode — cuts token usage ~75% |
| `sync-grill-me` | Interview the user relentlessly about a plan or design until reaching shared understanding |

### Content (`content-workflow`)
| Skill | Description |
|-------|-------------|
| `sync-web-content-writer` | Write and optimize static web pages - homepages, service pages, about pages, landing pages, FAQ sections, and portfolio entries |
| `sync-article-writer` | Write and optimize blog posts and articles - how-to guides, listicles, opinion pieces, pillar content, and news articles |
| `sync-content-strategist` | Audit existing content for SEO and AI readability issues, rewrite flagged sections, and produce content strategy recommendations |

## Workflow Sequence

```
Sales:  sync-client-discovery → sync-requirement-analyzer → sync-proposal-grill → sync-proposal-writer → sync-quotation
                                                                                       ↓ (client revisions)
                                                                               sync-proposal-revision → sync-proposal-writer → sync-quotation
                                                                                       ↓ (client approves)
BA:     sync-ba-project-intake → sync-database-designer → sync-sprint-planner → sync-final-design
                                                                                       ↓ (FDD approved)
PM:     pm-task-orchestrator [Stage 1: sync-backend-task-creator + sync-ui-task-creator (parallel) → Stage 2: sync-frontend-task-creator]
Eng:    sync-dev-session → sync-dev-tdd → sync-qa-planner → sync-qa-runner → sync-qa-to-ticket → sync-dev-to-fix → sync-qa-runner (re-run)
```

QA plan artifacts are written to `docs/qa/qa-plan/`. All other artifacts are written to `docs/{workflow-phase}/{artifact}.md`.

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
