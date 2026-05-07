# ADR 0001 — WordPress as skills distribution host

**Status:** Accepted

## Context

Skills need to be installable by non-technical team members (sales, BA) on both Windows and Mac with a single command and no prerequisites. The source repo is private (company IP). Users do not have Node.js, `gh` CLI, or developer tooling.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Public npm registry | Exposes company workflow IP publicly |
| GitHub Packages npm | Requires per-user npm config + PAT before `npx` works — too much friction for non-devs |
| `gh` CLI + private repo | Requires `gh auth login` — non-devs don't have `gh` installed |
| Manual ZIP distribution via Slack/email | No stable URL; admin burden scales with team size |

## Decision

CI uploads the skills ZIP to WordPress media on every release. A WordPress page ("pointer page") holds the current ZIP URL as its content. CI updates it via the REST API after each upload. Install scripts (`install.ps1`, `install.sh`) are uploaded to WordPress once and read the pointer page to find the current ZIP URL.

**GitHub secrets required:** `WP_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`, `WP_POINTER_PAGE_ID`

## Trade-offs accepted

- WordPress media files are publicly accessible by direct URL even with a site login — the skills ZIP is not truly gated. This was accepted: the skills contain no credentials or client data, and the URL is not indexed or advertised.
- A WordPress application password must be stored as a GitHub secret.
- The pointer page must be created manually once before CI can run.
