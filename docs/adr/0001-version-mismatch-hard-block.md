# Hard-block on artifact version mismatch

When a downstream skill detects that its immediate upstream artifact has a newer version than
what was recorded in the consuming artifact's `source_versions`, it hard-blocks and refuses to
proceed — it does not warn-and-continue. The consuming artifact must be regenerated from the
updated upstream before the skill can run.

We chose hard-block over warn-and-gate because a stale task list or test plan fed into
implementation produces wrong code that passes review — the damage is invisible until QA or
production. A warning is easy to dismiss; a block cannot be. The cost of regenerating tasks
from an updated FDD is low compared to the cost of discovering mid-sprint that the
implementation was built against a superseded spec.

## Considered Options

**Warn-and-gate:** Surface the version mismatch and list which modules changed, then ask
"continue with current tasks or regenerate?" Rejected because the gate is a choice — under
deadline pressure, teams will choose to continue, which defeats the purpose of version tracking.
