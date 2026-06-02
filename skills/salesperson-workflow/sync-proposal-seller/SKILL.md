---
name: sync-proposal-seller
version: 1.0.0
description: >
  Adds the sales narrative layer on top of the scope proposal from sync-proposal-writer. The BA
  proposal defines what will be built; this skill writes the Proposal Cover - the part the client
  reads first and the part that wins or loses the deal. Trigger when a Sales team member says
  "make the proposal sell", "add the cover", "write the proposal cover", "proposal is ready to
  send", or after sync-proposal-writer produces a proposal file. Always run after
  sync-proposal-writer and before the proposal is sent to the client. Hands off to
  sync-deal-followup after sending.
---

# Proposal Seller

The BA proposal defines scope. This skill writes what wins the deal.

Workflow: **[proposal-writer] -> proposal-seller -> deal-followup**

---

## Before You Start

Find the latest proposal file:
- Check `docs/sales/` for `{project-name}-proposal.md` and any `{project-name}-proposal-v*.md` files
- Use the highest version
- Read the proposal file to understand the project, client, and scope before prompting the rep

---

## Step 1 - Prompt for Sales Input

The Proposal Cover cannot be AI-generated. It must come from the rep who knows the client.

Ask the rep three questions. Wait for each answer before asking the next. Push back on vague answers.

**Q1 - The Outcome:**
"In one sentence, what is the business result the client gets from this investment? Frame it from their perspective, not ours."

*If the answer is vague (e.g., "a better system", "more efficiency"): push back.*
"Too vague. What specifically improves? By how much? For who? Give me something the client can feel."

*Accept only a specific, client-framing answer. Example: "Their procurement team stops chasing approvals over email and gets every purchase request reviewed and closed in under 24 hours."*

**Q2 - Why Syntactics:**
"Name one specific reason we are the right fit for this client. Not a general capability - something relevant to this project, this industry, or this client's specific risk."

*If the answer is generic (e.g., "we're experienced", "we have a good team"): push back.*
"That's true of every agency. What is specific to this client's situation? A similar project we delivered? A domain we know? A risk we've handled before that they're facing now?"

*Accept only a specific, verifiable answer. Example: "We built a similar multi-role approval workflow for a construction firm last year and know where these systems go sideways."*

**Q3 - Next Step:**
"What do you want the client to do after reading this proposal? And what happens on our side if they say yes?"

*Accept a concrete next action. Example: "Book a 30-minute review call. If they agree, we send a contract and schedule kickoff within the week."*

---

## Step 2 - Write the Proposal Cover

Write the Proposal Cover block and **prepend it to the existing proposal file** before the current cover page. Do not replace or alter any existing content below the cover.

Follow `references/output-format.md` exactly.

### Self-Check Before Writing

- [ ] The Outcome is specific and uses the client's language, not agency language
- [ ] Why Syntactics names something concrete and relevant to this project, not a general credential
- [ ] What Happens Next states a specific action and a Syntactics-side response, not "we'll be in touch"

If any check fails, return to Step 1 and re-prompt for that specific input.

---

## Step 3 - Deliver

State the updated file path, then say:

```
Proposal Cover added to {file-path}.

The proposal is ready to send. When you send it:
- Next: sync-deal-followup - start the follow-up schedule immediately. Most proposals die from silence, not rejection.
```

---

## Reference Files

- `references/output-format.md` - Proposal Cover template with section-by-section guidance
