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
irm https://development.websiteprojectupdates.com/wiki/wp-content/uploads/install.ps1 | iex
```

**Mac** — paste into Terminal:
```bash
curl -fsSL https://development.websiteprojectupdates.com/wiki/wp-content/uploads/install.sh | bash
```

Restart Claude Code after the script completes.

To update skills, run the same command again.

## Development

Skills are developed directly in the `skills/` directory. Push to `main` — CI uploads the latest skills ZIP to WordPress automatically.

To test locally:
1. Edit skills in `skills/{workflow}/{skill}/SKILL.md`
2. Push to `main`
3. CI uploads the new ZIP and updates the pointer page
4. Run the install command above to get the latest version

## Structure

```
skills/
  {workflow}-workflow/
    {skill-name}/
      SKILL.md          # skill definition + frontmatter (name, version, description)
      references/       # supporting templates, question banks, output formats
scripts/
  install.ps1           # Windows install script (hosted on WordPress)
  install.sh            # Mac/Linux install script (hosted on WordPress)
.github/workflows/
  sync-skills.yml       # CI: creates ZIP, uploads to WordPress, updates pointer page
docs/adr/
  0001-wordpress-distribution.md
```

## CI/CD

On push to `main` when skill files change: creates a skills ZIP, uploads it to WordPress, and updates the pointer page with the new URL. No manual step required after initial setup.

## Distribution Setup (one-time, admin only)

Complete these steps in order. **Do not proceed to the next step until the current one is done.**

### Step 1 — Create the WordPress pointer page

1. Log in to `https://development.websiteprojectupdates.com/wiki/wp-admin`
2. Go to **Pages → Add New**
3. Title: `Skills Latest` (or any title — users never see it)
4. Leave the content blank for now
5. Publish the page
6. Note the page ID from the URL: `post.php?post=**{ID}**&action=edit`

### Step 2 — Update the install scripts with the page ID

In this repo, open `scripts/install.ps1` and `scripts/install.sh`. Replace `POINTER_PAGE_ID` in the `$PointerUrl` / `POINTER_URL` line with the ID from Step 1.

Commit and push to `main`.

### Step 3 — Upload install scripts to WordPress

1. Go to **Media → Add New** in WordPress admin
2. Upload `scripts/install.ps1` — note the file URL
3. Upload `scripts/install.sh` — note the file URL
4. Verify the URLs match exactly:
   - `…/wp-content/uploads/install.ps1`
   - `…/wp-content/uploads/install.sh`

   If WordPress renames the files (e.g., `install-1.ps1`), delete and re-upload until the names are clean.

### Step 4 — Create a WordPress application password

1. Go to **Users → Profile** in WordPress admin
2. Scroll to **Application Passwords**
3. Name it `GitHub Actions` and click **Add New Application Password**
4. Copy the generated password immediately — it won't be shown again

### Step 5 — Add GitHub Actions secrets

In the GitHub repo, go to **Settings → Secrets and variables → Actions → New repository secret**. Add these four secrets:

| Secret | Value |
|---|---|
| `WP_URL` | `https://development.websiteprojectupdates.com/wiki` |
| `WP_USERNAME` | Your WordPress username |
| `WP_APP_PASSWORD` | The application password from Step 4 |
| `WP_POINTER_PAGE_ID` | The page ID from Step 1 |

### Step 6 — Trigger the first release

Push any change to a `SKILL.md` file (or re-push the commit from Step 2) to `main`. CI will upload the first ZIP and update the pointer page. From this point on, every skill change triggers an automatic release.
