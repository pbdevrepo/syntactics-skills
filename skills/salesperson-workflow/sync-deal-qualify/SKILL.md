---
name: sync-deal-qualify
version: 1.0.0
description: >
  Qualifies a new deal before investing BA hours in discovery or scoping. Behaves like a senior
  sales manager reviewing a new lead - asks five qualification questions one at a time, scores each
  dimension (Green / Yellow / Red), and outputs a Deal Scorecard with a go/no-go recommendation.
  Trigger when a Sales team member says "new lead", "new client", "should we pursue this", "qualify
  the deal", "is this worth it", or at the start of any new client conversation before discovery
  begins. Always run before sync-sales-discovery or sync-client-discovery.
---

# Deal Qualify

Gate before investing BA hours. Qualify whether this deal is worth pursuing.

Workflow: **deal-qualify -> sales-discovery -> [requirement-analyzer -> proposal-grill -> proposal-writer -> quotation] -> proposal-seller -> deal-followup**

---

## Step 1 - Get the Lead Context

Ask two questions before scoring:

1. **"What is the client's name and what do they want to build?"** - one sentence is enough
2. **"How did this lead come in?"** - referral, inbound inquiry, cold outreach, existing client upsell

Do not proceed until you have both answers.

---

## Step 2 - Run the Qualification Questions

Ask each question one at a time. Wait for the answer before asking the next. Do not batch them.

**Q1 - Budget:** "Do you have any signal on their budget - a range they mentioned, a project size they referenced, or any financial context from the conversation?"

**Q2 - Decision-maker:** "Who are you talking to? Do they have authority to sign a contract, or is there someone above them who makes the final call?"

**Q3 - Timeline:** "Do they have a specific deadline or launch date, or are they still exploring with no urgency?"

**Q4 - Competition:** "Are we the only vendor they're talking to, or are they evaluating others? Any names mentioned?"

**Q5 - Problem clarity:** "How clearly has the client defined what they need? Do they have a brief, an RFP, or specific features in mind - or is the problem still vague?"

---

## Step 3 - Score and Output the Deal Scorecard

Apply `references/scoring-guide.md` to score each dimension Green / Yellow / Red.

Output the Deal Scorecard to chat only - do not write to file:

```
## Deal Scorecard - [Client Name]

| Dimension | Signal | Status |
|---|---|---|
| Budget | [rep's answer paraphrased] | [Green / Yellow / Red] |
| Decision-maker | [rep's answer paraphrased] | [Green / Yellow / Red] |
| Timeline | [rep's answer paraphrased] | [Green / Yellow / Red] |
| Competition | [rep's answer paraphrased] | [Green / Yellow / Red] |
| Problem clarity | [rep's answer paraphrased] | [Green / Yellow / Red] |

**Overall: [Green / Yellow / Red]**

**Recommendation:** [see logic below]
```

**Recommendation logic:**
- 4-5 Green, 0 Red: Green - proceed to sync-sales-discovery
- Mix of Green and Yellow, 0-1 Red (and that Red is not Budget): Yellow - proceed; flag which Yellow dimensions to resolve on the discovery call
- Budget is Red, OR 3+ dimensions are Red: Red - do not invest BA hours yet

---

## Step 4 - State the Next Step

**If Green or Yellow:**

State which skill to run next and list any Yellow dimensions as targeted questions for the discovery call:

```
Next: sync-sales-discovery - pass the client name and one-liner.

[If any Yellow dimensions exist]
Resolve on the discovery call:
- [Dimension]: [specific question to ask]
- [Dimension]: [specific question to ask]
```

**If Red:**

State the hold and why:

```
Recommendation: hold.

[Name each Red dimension and the specific risk it carries]
[State the condition that would change the score - e.g., "Revisit when the decision-maker is confirmed in the room"]
```

The rep can override a Red recommendation, but the scorecard stands in chat as the record.

---

## Reference Files

- `references/scoring-guide.md` - Scoring criteria per dimension with Green / Yellow / Red thresholds and overall logic
