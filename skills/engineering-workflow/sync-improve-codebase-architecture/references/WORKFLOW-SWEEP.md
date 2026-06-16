# Architecture Sweep Workflow

Spec for `arch-sweep.js` - the parallel exploration workflow that replaces the single Explore
agent in `sync-improve-codebase-architecture`. Distributed to `~/.claude/workflows/arch-sweep.js`
by the install script.

## Purpose

A single Explore agent can only walk one part of the codebase at a time. The sweep fans out
one agent per top-level module so all modules are reviewed in parallel, then runs adversarial
reviewers on the strongest candidates before the skill sees any results. The grilling loop
(Step 3 of the skill) runs unchanged on the output.

## Phases

### Phase 1 - Context load (1 agent)

Reads `CONTEXT.md` and any ADRs in `docs/adr/`. Returns domain terms and active ADR rules
as a plain-text block. All downstream agents receive this block verbatim so they use the
correct vocabulary and don't re-suggest decisions already recorded in ADRs.

### Phase 2 - Module discovery (1 agent)

Globs the project root for top-level directories. Excludes: `node_modules`, `vendor`, `.git`,
`dist`, `build`, `coverage`, `public`, `storage`, `.claude`, `docs`, `scripts`, `tests`,
`test`, `__tests__`, `.github`. Reads 1-2 files per directory to determine module purpose.
Returns JSON: `{ modules: [{name, path, purpose}] }`.

### Phase 3 - Fan-out exploration (1 Explore agent per module)

Up to 16 agents run in parallel (one batch at a time if more than 16 modules). Each agent:

- Applies five checks: shallow module test, deletion test, leaking seam, testability, tight coupling
- Uses exact domain terms from Phase 1 context
- Returns JSON candidates with: title, files, problem, solution, dependency_category, strength, contradicts_adr
- Returns empty candidates if no real friction exists - does not invent problems

Dependency categories follow `DEEPENING.md`:
- `in-process` - pure computation, no I/O
- `local-substitutable` - has a local test stand-in (PGLite, in-memory FS)
- `ports-and-adapters` - remote but owned service
- `mock` - true external (Stripe, Twilio, etc.)

### Phase 4 - Adversarial review (1 agent per Strong candidate)

Each `Strong` candidate gets an independent challenger that asks:
1. Does deepening truly concentrate complexity, or just relocate it?
2. Is the proposed seam justified by at least two adapters (production + test)?
3. Does this contradict an active ADR?
4. Is the friction real or stylistic?

Verdicts either uphold `Strong` or downgrade to `Worth exploring`. The challenger cannot
upgrade a candidate - only maintain or lower the rating.

### Phase 5 - Synthesis (script)

Merges all exploration results and applies adversarial verdicts. Ranks output: Strong first,
then Worth exploring, then Speculative. Returns JSON to the calling skill.

## Output shape

```json
{
  "candidates": [
    {
      "title": "string",
      "files": ["string"],
      "problem": "string",
      "solution": "string",
      "dependency_category": "in-process | local-substitutable | ports-and-adapters | mock",
      "strength": "Strong | Worth exploring | Speculative",
      "contradicts_adr": "ADR-ID or null",
      "adversarial_note": "string or undefined"
    }
  ],
  "meta": {
    "modules_scanned": 0,
    "candidates_found": 0,
    "strong_reviewed": 0
  }
}
```

## Scale limits

- Max 16 agents run concurrently (Phase 3 batches if more modules than the cap)
- Phase 4 caps at 16 adversarial agents per run (largest 16 Strong candidates)
- Total agent count: 2 (context + discovery) + N modules + M strong candidates
- A 20-module project with 4 Strong candidates uses ~26 agents

## Saving the workflow

Run the workflow once via `ultracode: /arch-sweep`. When the run completes:
1. Open `/workflows` in the session
2. Select the run and press `s`
3. Save to `~/.claude/workflows/arch-sweep.js` (personal, all projects) or
   `.claude/workflows/arch-sweep.js` (project-scoped, shared with the team)

The install script distributes the pre-written version automatically if `arch-sweep.js` is
not already present at `~/.claude/workflows/arch-sweep.js`.
