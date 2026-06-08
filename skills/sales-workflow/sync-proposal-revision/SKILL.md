---
name: sync-proposal-revision
version: 1.2.0
description: >
  Handles client feedback and revisions in the Sales workflow at Syntactics Inc. Trigger when a
  Sales team member says "client has revisions", "client sent feedback", "update the proposal",
  "revise the intake", or when a client provides comments on an existing proposal. Reads the
  latest intake file, applies client changes, produces a new versioned intake file, and hands
  off to sync-proposal-writer and sync-quotation. Always run after the client reviews a proposal.
---

# Proposal Revision

Apply client feedback to the latest intake document. Produce a versioned intake file with a delta summary. Trigger sync-proposal-writer and sync-quotation on the new version.

Handle multiple revision rounds: always diff against the prior version, not the original. The delta must be accurate for round 2, round 3, and beyond.

Workflow: **client feedback -> proposal-revision -> proposal-writer -> quotation**

---

## Before You Start

1. Ask Sales for:
   - The project name
   - The client comments or revision notes (paste, upload, or describe them)
2. Scan `docs/ba/` to find the latest intake file:
   - If only `{project-name}-intake.md` exists: this is v1, next version is v2.
   - If `{project-name}-intake-v{N}.md` exists: find the highest N, next version is N+1.
3. Read the latest intake file in full - this is the baseline for the diff.

---

## Revision Rules

- **Diff against the prior version, not the original.** If the client is reviewing v2, apply their
  feedback to v2 to produce v3 - do not re-compare against v1.
- **Preserve resolved grilling.** Do not reopen modules that were already resolved and accepted by
  the client. Only change what the client explicitly flagged.
- **Classify every change.** Each delta must be labeled as one of:
  - `Added` - new scope the client requested
  - `Removed` - scope the client wants dropped or deferred
  - `Updated` - existing scope the client wants modified
- **Sharpen fuzzy feedback.** When the client uses a vague or overloaded term in their comments,
  do not infer - propose a precise interpretation and confirm with Sales before applying the change.
  Example: "Client said 'make reports better' - do they mean add filtering, add export, or change
  the layout? Each is a different scope item."
- **Flag ambiguity.** If a client comment is unclear and Sales cannot resolve it, mark it as an
  Open Item and do not apply the change. Never guess scope.

---

## Workflow

### Step 1 - Parse Client Feedback

Read through all client comments or revision notes. For each item:
- Identify which module or section it refers to.
- Classify it as `Added`, `Removed`, or `Updated`.
- If a term is vague, propose a canonical name and confirm with Sales before classifying.
- If unclear which module it maps to, flag it and ask Sales before proceeding.

Produce a working delta list:
```
Delta Summary:
- Added: [description]
- Removed: [description]
- Updated: [description - old value -> new value]
```

Confirm the delta list with Sales before writing the new file. Say:
```
Here is what I understood from the client's feedback:
[delta list]

Does this look correct? Any clarifications before I write the updated requirements?
```

### Step 2 - Write the New Requirements File

Once Sales confirms the delta:

1. Copy the latest requirements file as the base.
2. Apply all `Added`, `Removed`, and `Updated` changes to the relevant modules.
3. Append a **Revision History** section at the bottom of the file:

```markdown
---

## Revision History

### v{N} - {YYYY-MM-DD}

**Delta from v{N-1}:**

- Added: {description}
- Removed: {description}
- Updated: {description - old -> new}

**Status:** Pending Grilling / Approved
```

4. Write the file: `docs/ba/{project-name}-intake-v{N}.md`

### Step 3 - Check for New Ambiguities

Scan the updated intake for any newly introduced modules or significantly expanded scope:
- If a new module was added by the client, mark it `Ambiguous` and flag it for grilling before
  the proposal is written.
- If all changes are clear and bounded, mark the new intake **Status:** `Approved` and
  proceed.

> If new ambiguities exist, stop here and run sync-proposal-grill on the new intake file
> before continuing to Step 4.

### Step 4 - Hand Off

State the new intake file path, then say:

```
Intake v{N} written with the following changes:
[delta summary]

Next: running sync-proposal-writer to produce proposal-v{N}.md.
```

Trigger sync-proposal-writer. It will:
- Detect the new intake version automatically.
- Write `{project-name}-proposal-v{N}.md` with a Revision Summary section.

After the proposal is written, trigger sync-quotation on the new proposal file.
