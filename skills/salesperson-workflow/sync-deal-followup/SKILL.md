---
name: sync-deal-followup
version: 1.0.0
description: >
  Drives a deal forward after the proposal is sent. Generates a structured follow-up schedule and
  handles objections when the client pushes back on price, scope, or timing. Trigger when a Sales
  team member says "proposal sent", "following up on the proposal", "client hasn't responded",
  "client is pushing back on price", "they want to reduce scope", "client went quiet", or after
  sync-proposal-seller. Always run after the proposal is delivered to the client.
---

# Deal Followup

Most proposals die from silence, not rejection. Follow up.

Workflow: **proposal-seller -> deal-followup**

---

## Step 1 - Get the Context

Ask three questions before generating the follow-up schedule:

1. **"When was the proposal sent?"** - exact date
2. **"What was the next step the client agreed to on the discovery call?"** - e.g., "they said they'd review by Friday"
3. **"Has the client responded at all since you sent it?"** - if yes, what did they say?

---

## Step 2 - Determine the Mode

Based on the answers:

**Mode A - No Response Yet:** Client has not replied since the proposal was sent. Generate the follow-up schedule.

**Mode B - Objection Raised:** Client has responded with a specific concern. Go directly to Step 4 - Objection Handler.

**Mode C - Positive Response, Stalled:** Client engaged positively but the deal has not advanced. Generate a light nudge focused on confirming the next step.

---

## Step 3 - Follow-Up Schedule (Mode A)

Output the follow-up schedule to chat. Do not write to file.

Calculate exact dates based on the send date provided in Step 1.

```
## Follow-Up Schedule - {Client Name}

Proposal sent: {date}

**Day 2 - {date}: Value Check-in**
Subject: "Quick check - did the proposal land clearly?"
Message: "Hi [Name], just checking in to make sure the proposal came through clearly and nothing got lost in translation. Happy to walk through any section or answer questions before you share it internally. Let me know."

Goal: Open a door. Not a nudge. If they say yes, offer a 15-minute call.

---

**Day 5 - {date}: Quiet Nudge**
Subject: "Following up"
Message: "Hi [Name], following up on the proposal from [date]. Any questions from your team I can help answer? Happy to jump on a quick call this week."

Goal: Surface any internal blockers. If they name one, go to the Objection Handler.

---

**Day 10 - {date}: Soft Urgency**
Subject: "Wanted to give you a heads up"
Message: "Hi [Name], I wanted to give you a heads up - we're finalizing our Q[X] project schedule this week and want to make sure we can hold a slot for [Client Name] if you decide to move forward. No pressure, but if timing is a factor, let me know and I'll reserve the start date for you."

Goal: Create real (not fake) urgency. Only use this message if the slot is genuinely limited.

---

**If no response after Day 10:**
Two options:
1. Reach out to a different contact at the company if one exists - try the decision-maker directly
2. Send one final message: "Hi [Name], I don't want to keep following up if the timing isn't right. If you'd like to revisit this in the future, I'm happy to reconnect. Let me know." Then stop.
```

---

## Step 4 - Objection Handler

When the client raises a specific objection, identify the type and respond with the matching playbook from `references/objection-playbook.md`.

Ask the rep: **"What exactly did the client say?"** - get the actual words before routing to a playbook.

**Objection types:**
- **Price** - "This is more than we expected", "Can you reduce the cost?", "We have a smaller budget"
- **Scope** - "Do we need all of this?", "Can we cut some modules?", "This feels too big"
- **Timing** - "We're not ready yet", "Let's revisit in a few months", "We have too much on right now"
- **No response** - ghosted after opening or after a positive first reply

After identifying the type, output the response script from the objection playbook and ask: **"What is the next step you want to agree with the client before ending this conversation?"**

Do not let the rep leave the objection conversation without a committed next step.

---

## Step 5 - Confirm the Next Step

After any follow-up or objection response, always end with:

**"What is the specific next step, and when does it happen?"**

The answer must be:
- A concrete action (not "we'll talk soon")
- Owned by someone (the client, the rep, or both)
- Time-bound (a date or a deadline)

Output the agreed next step:

```
Next step: [action]
Owner: [client / rep / both]
By: [date or trigger]
```

If the rep cannot name a next step, the deal is not advancing. Say so.

---

## Reference Files

- `references/objection-playbook.md` - Per-objection response scripts and routing logic
