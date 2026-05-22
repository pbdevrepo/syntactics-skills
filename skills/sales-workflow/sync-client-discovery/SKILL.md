---
name: sync-client-discovery
version: 1.1.0
description: >
  Pre-requirement discovery skill for the Sales workflow at Syntactics Inc. Generates structured
  discovery questions for clients who have no brief, document, or clear direction. Trigger when a
  Sales team member says "client has no idea what they want", "no requirements yet", "start discovery",
  "client discovery", "discovery questions", or when a new client has not yet provided any brief or RFP.
  Always run before sync-requirement-analyzer when client input is absent or extremely vague.
---

# Client Discovery

Generate a structured discovery conversation for clients who have not provided a brief or RFP.
Produce a discovery summary `.md` that feeds directly into `sync-requirement-analyzer`.

Workflow: **client-discovery -> requirement-analyzer -> proposal-grill -> proposal-writer -> quotation**

---

## Before You Start

Ask: **"What is the project name?"** - kebab-case, lowercase (e.g., `client-portal`).

Then ask: **"How would you like to run the discovery?"**
- **Interactive** - Claude asks questions one group at a time; sales rep answers on behalf of the client
- **Document** - Claude generates a full questionnaire the sales rep can print or share with the client directly

---

## Interactive Mode

Work through each group below in order. Ask all questions in the group, wait for answers, then move on.

End each group with: `Got it. Moving on to [next group].`

See `references/question-bank.md` for the full question pool.

**Group 1 - Business Goals and Pain Points** (`## Business Goals`)
**Group 2 - Project Type and Features** (`## Project Type and Features`)
**Group 3 - Budget and Timeline** (`## Budget and Timeline`)
**Group 4 - Tech and Design Preferences** (`## Tech and Design Preferences`)

### Sharpen vague answers immediately

When a client answer uses an overloaded or unclear term, do not accept it and move on. Propose a
precise interpretation and confirm it before marking the question closed.

Examples:
- Client says "something like Facebook" - ask: "Do you mean a social feed where users post updates,
  or a profile-and-connections system? Those are different in scope."
- Client says "basic reporting" - ask: "Do you mean a live dashboard the user filters, or a
  generated export (PDF, CSV)? Those are different modules."
- Client says "admin panel" - ask: "Do you mean internal staff only, or does the client's own admin
  users also need access? That changes the role model."

Resolve the term before moving to the next question.

### Probe vague scope with concrete scenarios

When a client describes a feature broadly, invent a specific scenario to test its boundaries:
- "You mentioned approval workflows - if a Manager rejects a request that a Director already
  approved, who wins? Is there an escalation path?"
- "You said users can 'manage their profile' - can they change their email address, or is that
  locked to an admin?"

A precise scenario forces a precise answer. A general description leaves scope gaps for BA to discover too late.

---

## Document Mode

Write the questionnaire directly to file - do not output it in chat.

File: `docs/sales/{project-name}-discovery.md`

Use all questions from `references/question-bank.md`, grouped and numbered, formatted for a
client to fill in. Add a blank answer line after each question.

After writing, state the file path and say:

```
Discovery questionnaire saved. Share {project-name}-discovery.md with the client.
Once answered, pass it to sync-requirement-analyzer as the client input.
```

---

## After Groups - Discovery Summary (Interactive Mode Only)

After all groups are answered, write the summary directly to file - do not output it in chat.

File: `docs/sales/{project-name}-discovery.md`

Follow `references/output-format.md` for the exact structure.

Then state the file path and say:

```
Discovery captured. Next: sync-requirement-analyzer - pass {project-name}-discovery.md as
the client input to extract modules and generate a requirements document.
```

---

## Reference Files

- `references/question-bank.md` - Discovery questions by category
- `references/output-format.md` - Discovery summary structure
