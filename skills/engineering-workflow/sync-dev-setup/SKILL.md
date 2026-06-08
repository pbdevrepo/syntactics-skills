---
name: sync-dev-setup
version: 1.1.0
description: Sets up an `## Agent skills` block in AGENTS.md/CLAUDE.md and `docs/agents/` so the engineering skills know this repo's issue tracker (GitHub or local markdown), triage label vocabulary, and domain doc layout. Run once per repo before first use of `sync-dev-session`, `sync-dev-tdd`, `sync-qa-runner`, or `sync-dev-to-fix` — or if those skills appear to be missing context about the issue tracker, triage labels, or domain docs.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels** — the strings used for the five canonical triage roles
- **Domain docs** — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Is there already an `## Agent skills` section in either?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use

### 2. Present findings and ask

Summarise what's present and what's missing. Then walk the user through the three decisions **one at a time** — present a section, get the user's answer, then move to the next. Don't dump all three at once.

Assume the user does not know what these terms mean. Each section starts with a short explainer (what it is, why these skills need it, what changes if they pick differently). Then show the choices and the default.

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `sync-qa-to-ticket`, `sync-qa-runner`, `sync-dev-session`, and `sync-dev-tdd` read from and write to it — they need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

**Section B — Label vocabulary.**

> Explainer: All engineering and QA skills share a single label set. This setup step creates every label the workflow needs — triage roles, QA status, type, priority, area, and escalation. Skills like `sync-qa-to-ticket` and `sync-qa-runner` will halt and tell you to run this first if labels are missing. You only need to run this once per repo.

Create the following labels via the issue tracker. For GitHub, use the `gh` CLI or GitHub MCP:

**Triage labels:**
- `needs-triage` — color: `#ededed` — maintainer needs to evaluate
- `needs-info` — color: `#d93f0b` — waiting on reporter
- `ready-for-agent` — color: `#0075ca` — fully specified, AFK-ready
- `ready-for-dev` — color: `#0075ca` — ready for a developer to implement
- `ongoing` — color: `#6f42c1` — dev is actively working on this
- `ready-for-qa` — color: `#0e8a16` — fix submitted, ready for QA re-run
- `verified` — color: `#2cbe4e` — QA confirmed fix passes
- `wontfix` — color: `#ffffff` — will not be actioned

**Type labels:**
- `bug` — color: `#d73a4a`
- `regression` — color: `#f9d0c4`
- `out-of-scope` — color: `#e4e669`

**Priority labels:**
- `P1-critical` — color: `#b60205`
- `P2-high` — color: `#e11d48`
- `P3-medium` — color: `#f97316`
- `P4-low` — color: `#84cc16`

**Area labels:**
- `area:fe` — color: `#0891b2`
- `area:be` — color: `#0e7490`
- `area:fs` — color: `#155e75`

**Escalation labels:**
- `for-ba-confirmation` — color: `#fbca04`

Note: `turnover:N` labels (e.g. `turnover:1`, `turnover:2`) are created dynamically by `sync-qa-runner` during re-runs. Do not pre-create them here.

Ask the user if they want to override any label names to match their existing vocabulary. If their repo already has labels, check for conflicts before creating.

**Section C — Domain docs.**

> Explainer: Some skills (`sync-improve-codebase-architecture`, `sync-dev-diagnose`, `sync-dev-tdd`) read a `CONTEXT.md` file to learn the project's domain language, and `docs/adr/` for past architectural decisions. They need to know whether the repo has one global context or multiple (e.g. a monorepo with separate frontend/backend contexts) so they look in the right place.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. Most repos are this.
- **Multi-context** — `CONTEXT-MAP.md` at the root pointing to per-context `CONTEXT.md` files (typically a monorepo).

### 3. Discover available tools (automatic — no user questions)

Before confirming and writing, discover what tools are available in this project.

**Read the following (read-only, no user decision needed):**

1. `.claude/settings.json` (project-level) — extract `mcpServers` object keys and their `command` or `url` fields
2. `~/.claude/settings.json` (user-level) — same extraction
3. `.claude/skills/` directory — list subdirectory names (each is an available local skill)
4. `CLAUDE.md` or `AGENTS.md` — scan for any existing tool usage instructions

**Classify each discovered MCP by capability tier:**

| If MCP name or command contains... | Classify as |
|------------------------------------|-------------|
| `playwright` | `testing:e2e` - Playwright browser automation via MCP tools |
| `cypress` | `testing:e2e` - Cypress browser automation via MCP tools |
| `laravel`, `laravel-boost` | `framework:laravel` - Laravel/Eloquent patterns and conventions |
| `shadcn`, `shadcn-ui` | `framework:shadcn` - shadcn/ui component generation |
| `wordpress`, `wp-vibe` | `framework:wordpress` - WordPress/WooCommerce patterns |
| `context7` | `docs:lookup` - Live library documentation lookup |
| `github`, `gitlab` | `vcs:issues` - Issue tracker integration |
| Any other MCP | `other` - record name and command as-is |

**Write `docs/agents/tools.md`** using the seed template at `tools.md` in this skill folder. Populate it from the discovery results above.

**Add `### Available tools` to the `## Agent skills` block** (see Section 4 for the full block format).

If no MCPs are found and no `.claude/skills/` directory exists, still write `docs/agents/tools.md` with an empty table and a note — the file's presence signals that discovery has run.

Re-run this setup whenever new MCPs are added to the project. `sync-dev-tdd` and `sync-qa-runner` both read `docs/agents/tools.md` at startup.

### 4. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to whichever of `CLAUDE.md` / `AGENTS.md` is being edited (see step 4 for selection rules)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

Let them edit before writing.

### 4. Write

**Pick the file to edit:**

- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which one to create — don't pick for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa) — always edit the one that's already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.

### Available tools

[N MCPs registered; list capability tiers, e.g. "testing:e2e (Playwright MCP), framework:laravel (Laravel Boost)"]. [N local skills in .claude/skills/]. See `docs/agents/tools.md`.
```

Then write the four docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — label mapping
- [domain.md](./domain.md) — domain doc consumer rules + layout
- [tools.md](./tools.md) — available MCPs and local skills (populated from Section 3 discovery)

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later.

Re-run this skill when:
- Switching issue trackers
- Adding new MCP servers to `.claude/settings.json` (re-runs Section 3 to update `docs/agents/tools.md`)
- Restarting from scratch