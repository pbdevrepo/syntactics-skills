// arch-sweep.js
// Fans out one Explore agent per top-level module, runs adversarial review on Strong
// candidates, and returns a ranked candidate list for the sync-improve-codebase-architecture
// skill's HTML report and grilling loop.
//
// Invocation (from within the skill or directly):
//   /arch-sweep
//   /arch-sweep { "path": "src" }   <- scope to a subdirectory

const projectPath = args?.path || ".";
const MAX_CONCURRENT = 16;

// Phase 1: Load domain context (CONTEXT.md + ADRs)
const contextResult = await agent({
  prompt: `Load domain context for an architecture review at: ${projectPath}

1. Read CONTEXT.md at the project root if it exists. Extract all defined domain terms as a flat list.
2. Glob docs/adr/ for ADR files (*.md). Read each one. Extract: the ADR ID, the decision, and any module or path it applies to.

Return a structured plain-text summary with two sections:

## Domain Terms
- TermName: definition
(one line per term; write "none" if CONTEXT.md is absent)

## Active ADRs
- ADR-ID: decision | applies to: module/path or "general"
(one line per ADR; write "none" if no ADRs exist)`,
  tools: ["Read", "Glob"]
});

// Phase 2: Discover top-level modules
const discoveryResult = await agent({
  prompt: `Discover the top-level modules in the project at: ${projectPath}

1. Glob the path for immediate subdirectories.
2. Exclude: node_modules, vendor, .git, dist, build, coverage, public, storage, .claude, docs, scripts, tests, test, __tests__, .github.
3. For each remaining directory, read 1-2 files inside it to determine its domain or technical purpose in one sentence.

Return ONLY valid JSON, no other text:
{
  "modules": [
    { "name": "string", "path": "string", "purpose": "string" }
  ]
}`,
  tools: ["Glob", "Read"]
});

let moduleList = [];
try {
  moduleList = JSON.parse(discoveryResult).modules || [];
} catch (_) {}

if (moduleList.length === 0) {
  return JSON.stringify({
    error: "No modules discovered.",
    hint: "Check the project path. Top-level directories may all be in the exclude list.",
    candidates: []
  });
}

// Phase 3: Fan-out — one Explore agent per module, batched to respect the 16-agent cap
const batches = [];
for (let i = 0; i < moduleList.length; i += MAX_CONCURRENT) {
  batches.push(moduleList.slice(i, i + MAX_CONCURRENT));
}

const allRawExplorations = [];
for (const batch of batches) {
  const batchResults = await Promise.all(
    batch.map(mod =>
      agent({
        subagentType: "Explore",
        prompt: `Review the module at ${mod.path} for architectural improvement opportunities.

Module purpose: ${mod.purpose}

Domain context (use exact terms when naming candidates):
${contextResult}

Apply these checks to the code in ${mod.path}:

1. SHALLOW MODULE: Is the interface nearly as complex as the implementation? Would a caller have to understand most of the internals to use it correctly?
2. DELETION TEST: If you deleted this module, would complexity vanish (pass-through) or reappear spread across many callers (earning its keep)?
3. LEAKING SEAM: Do internal concepts bleed out to callers through the interface? Are callers forced to know about internals they shouldn't need?
4. TESTABILITY: Is there a seam at the right place to test behavior without wiring up the whole system?
5. TIGHT COUPLING: Is this module entangled with another module such that they change together constantly?

For each problem you find, produce a candidate. Use exact domain terms from the context above.
If no real friction exists, return an empty candidates array - do not invent problems.

Return ONLY valid JSON, no other text:
{
  "module": "${mod.name}",
  "candidates": [
    {
      "title": "short imperative phrase naming the deepening (e.g. Collapse the Order intake pipeline)",
      "files": ["relative/path/to/file.ext"],
      "problem": "one sentence: what hurts",
      "solution": "one sentence: what changes",
      "dependency_category": "in-process | local-substitutable | ports-and-adapters | mock",
      "strength": "Strong | Worth exploring | Speculative",
      "contradicts_adr": "ADR-ID or null"
    }
  ]
}`,
        tools: ["Read", "Glob", "Grep"]
      })
    )
  );
  allRawExplorations.push(...batchResults);
}

const allCandidates = allRawExplorations.flatMap(raw => {
  try {
    return JSON.parse(raw).candidates || [];
  } catch (_) {
    return [];
  }
});

const strongCandidates = allCandidates.filter(c => c.strength === "Strong");

// Phase 4: Adversarial review — one agent per Strong candidate (capped at 16)
const verdictMap = {};

if (strongCandidates.length > 0) {
  const reviewTargets = strongCandidates.slice(0, MAX_CONCURRENT);
  const adversarialResults = await Promise.all(
    reviewTargets.map(candidate =>
      agent({
        prompt: `You are an adversarial architecture reviewer. Challenge this refactor candidate.
Your goal: determine whether the "Strong" rating is deserved or inflated.

Candidate:
${JSON.stringify(candidate, null, 2)}

Active ADRs:
${contextResult}

Challenge on these points:
1. Does deepening this module truly concentrate complexity, or just relocate it?
2. Is the proposed seam justified by two distinct adapters (production + test)? A single-adapter seam is just indirection.
3. Does this refactor contradict an active ADR?
4. Is the identified friction real (callers suffer) or stylistic preference?

If you find a legitimate problem with the "Strong" rating, downgrade it.
If the rating is warranted, uphold it.

Return ONLY valid JSON, no other text:
{
  "title": "${candidate.title}",
  "upheld": true,
  "downgrade_to": null,
  "challenge": "one sentence explaining your verdict"
}

OR:
{
  "title": "${candidate.title}",
  "upheld": false,
  "downgrade_to": "Worth exploring",
  "challenge": "one sentence explaining why it was downgraded"
}`,
        tools: ["Read", "Grep"]
      })
    )
  );

  adversarialResults.forEach(raw => {
    try {
      const verdict = JSON.parse(raw);
      if (verdict.title) verdictMap[verdict.title] = verdict;
    } catch (_) {}
  });
}

// Apply verdicts and rank
const reviewed = allCandidates.map(candidate => {
  const verdict = verdictMap[candidate.title];
  if (verdict && !verdict.upheld && verdict.downgrade_to) {
    return { ...candidate, strength: verdict.downgrade_to, adversarial_note: verdict.challenge };
  }
  if (verdict && verdict.upheld) {
    return { ...candidate, adversarial_note: `Upheld: ${verdict.challenge}` };
  }
  return candidate;
});

const ranked = [
  ...reviewed.filter(c => c.strength === "Strong"),
  ...reviewed.filter(c => c.strength === "Worth exploring"),
  ...reviewed.filter(c => c.strength === "Speculative")
];

return JSON.stringify({
  candidates: ranked,
  meta: {
    modules_scanned: moduleList.length,
    candidates_found: allCandidates.length,
    strong_reviewed: strongCandidates.length
  }
}, null, 2);
