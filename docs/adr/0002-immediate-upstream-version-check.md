# Each skill checks immediate upstream version only

Skills in the version chain check only their direct input's version — not the full ancestry.
A Schema change blocks Sprint Task List regeneration. Once Sprint Tasks are regenerated, FDD
is stale and blocks FDD regeneration. Once FDD is regenerated, PM Tasks are stale. The cascade
propagates one step at a time.

We chose this over full-ancestry checking because full ancestry creates false positives: a
Schema typo fix that has no effect on a module's FDD entry would still hard-block a developer
mid-sprint from opening a dev session — even though every artifact between the schema and the
session is already correct. Immediate-upstream checking forces each artifact owner to review
and confirm their artifact before the cascade continues, which is the right review granularity
for an agency workflow.

## Considered Options

**Full ancestry check:** Every skill checks all upstream versions in its lineage. A single
Schema change surfaces as a block at `sync-dev-session` regardless of whether intermediate
artifacts were already updated. Rejected because it removes the per-artifact review step and
creates a disruptive chain reaction from minor upstream edits.
