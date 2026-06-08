export const workflows = [
  { id: 'sales', label: 'Sales', color: 'blue' },
  { id: 'ba', label: 'BA', color: 'violet' },
  { id: 'pm', label: 'PM', color: 'amber' },
  { id: 'engineering', label: 'Engineering', color: 'emerald' },
  { id: 'qa', label: 'QA', color: 'rose' },
  { id: 'must-have', label: 'Must-Have', color: 'slate' },
  { id: 'content', label: 'Content', color: 'orange' },
]

export const skills = [
  // Sales
  {
    name: 'sync-client-discovery',
    version: '2.4.0',
    workflow: 'sales',
    type: 'skill',
    description:
      'Research-first discovery for clients with no brief. Studies domain, maps industry process flows, runs competitor analysis, and produces a fillable discovery brief with pre-filled research and process-flow-anchored questions.',
  },
  {
    name: 'sync-proposal-revision',
    version: '1.2.0',
    workflow: 'sales',
    type: 'skill',
    description:
      'Applies client feedback to the intake document and produces a versioned intake file with a delta summary (Added/Removed/Updated). Feeds back to proposal-writer for revision round N.',
  },
  {
    name: 'sync-quotation',
    version: '1.1.0',
    workflow: 'sales',
    type: 'skill',
    description:
      'Generates an itemized quotation from the approved proposal. Module-by-module breakdown with sub-items and placeholder hour ranges per role (Design, FE, BE).',
  },

  // BA
  {
    name: 'sync-project-intake',
    version: '1.0.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Entry point for both the proposal and BA lifecycle. Accepts any client input (brief, RFP, notes, approved proposal). Two modes: Pre-Proposal (feeds proposal-grill) and Post-Approval (feeds database-designer). Produces docs/ba/{project-name}-intake.md.',
  },
  {
    name: 'sync-proposal-grill',
    version: '1.2.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Stress-tests the intake document before the proposal is written. Asks targeted questions on missed modules, ambiguous scope, integrations, deployment constraints, and edge cases. Updates intake status from Draft to Grilled.',
  },
  {
    name: 'sync-proposal-writer',
    version: '1.5.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Writes the client-facing proposal from the grilled intake. Includes a Recommended Deployment Stack section (inferred from scale, compliance, budget, and client preference). Hierarchical module - sub-feature - UI elements structure with auto-version numbering.',
  },
  {
    name: 'sync-database-designer',
    version: '1.4.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Expert relational database design: normalization (1NF-3NF), transactions, and production best practices. Includes spatie/laravel-permission and spatie/laravel-activitylog integration patterns. Outputs a .md schema file directly.',
  },
  {
    name: 'sync-sprint-planner',
    version: '1.2.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Converts the approved DB schema into a sprint task list - role-tagged, dependency-ordered, and ready-to-assign development tasks. Organized by priority and build order.',
  },
  {
    name: 'sync-final-design',
    version: '2.2.0',
    workflow: 'ba',
    type: 'skill',
    description:
      'Produces Final Design Documents (FDD) in v2.0 Business Applications Final Design Template format. Outputs docs/fdd/index.md plus one docs/fdd/{module-slug}.md per module. Strict version gate enforcement. Auto-triggers task-orchestrator on FDD approval.',
  },

  // PM
  {
    name: 'sync-design-to-stories',
    version: '1.0.0',
    workflow: 'pm',
    type: 'skill',
    description:
      'Analyzes design mockup images (PNG/JPG/PDF) and generates structured user stories and acceptance criteria per page with MP/US/AC IDs. Standalone skill with no workflow dependencies.',
  },
  {
    name: 'task-orchestrator',
    version: '1.2.0',
    workflow: 'pm',
    type: 'agent',
    description:
      'Auto-triggered by sync-final-design after FDD approval. Two-stage pipeline: Stage 1 generates backend tasks and UI design tasks in parallel (both from FDD); Stage 2 generates frontend tasks from Stage 1 outputs. Detects FDD version drift and reruns automatically.',
  },

  // Engineering
  {
    name: 'sync-dev-setup',
    version: '1.1.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'One-time per-repo setup. Scaffolds the Agent skills block in AGENTS.md and docs/agents/ with issue tracker info, triage labels, and domain doc layout. Reads .claude/settings.json for MCP servers and capability tiers. Writes docs/agents/tools.md.',
  },
  {
    name: 'sync-dev-session',
    version: '1.2.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'Task-level implementation grilling session anchored to the FDD. Challenges implementation decisions, surfaces gaps, constraints, and risks before coding starts. Saves session summary to docs/sessions/{be|fe|fullstack}/{Task-ID}-{date}.md.',
  },
  {
    name: 'sync-dev-tdd',
    version: '1.3.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'TDD red-green-refactor loop per task/module. Auto-detects prior dev session summary. Generates Swagger YAML for BE/fullstack sessions. Runs FDD Compliance Summary (Green/Yellow/Red coverage of business rules, validation, RBAC, and transitions).',
  },
  {
    name: 'sync-dev-to-fix',
    version: '1.0.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'TDD-driven bug fix skill. Fetches the GitHub issue from sync-qa-to-ticket, reads the FDD for expected behavior, and guides a failing test - fix - verify loop. Does not close issues (QA closes after sync-qa-runner confirms).',
  },
  {
    name: 'sync-dev-diagnose',
    version: '1.0.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'Disciplined diagnosis loop for hard bugs and performance regressions: Reproduce - Minimise - Hypothesise - Instrument - Fix - Regression-test. Uses the project domain glossary for mental model alignment.',
  },
  {
    name: 'sync-grill-with-docs',
    version: '1.0.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'Grilling session that challenges a plan against the existing domain model. Updates CONTEXT.md and ADRs inline as decisions crystallize. Stress-tests the plan against the project language and documented decisions.',
  },
  {
    name: 'sync-improve-codebase-architecture',
    version: '1.0.0',
    workflow: 'engineering',
    type: 'skill',
    description:
      'Finds improvement opportunities informed by CONTEXT.md domain language and docs/adr/ decisions. Surfaces architectural friction and proposes refactors for testability and AI-navigability using precise terminology.',
  },

  // QA
  {
    name: 'sync-qa-runner',
    version: '2.0.0',
    workflow: 'qa',
    type: 'skill',
    description:
      'Verifies implemented features against the FDD. Direct mode: accepts GitHub issue URL + FDD and derives test cases inline (no qa-plan needed). Detects test framework, runs UI and API tests, applies verified label on all-pass. Outputs QA run log to docs/qa/qa-runs/{Task-ID}-{date}.md.',
  },
  {
    name: 'sync-qa-to-ticket',
    version: '1.3.0',
    workflow: 'qa',
    type: 'skill',
    description:
      'Converts QA failures into structured GitHub child issues via MCP. Direct mode (GitHub URL + run log) and Legacy mode (qa-plan). Creates issue body with FDD references, parent issue link, and out-of-scope flags. No fix suggestions - only clear problem statements.',
  },

  // Must-Have
  {
    name: 'sync-caveman',
    version: '1.0.0',
    workflow: 'must-have',
    type: 'skill',
    description:
      'Ultra-compressed communication mode. Cuts token usage ~75% by dropping articles, filler words, pleasantries, and hedging while keeping full technical accuracy. Persists every response once triggered. Off only when user says "stop caveman".',
  },
  {
    name: 'sync-grill-me',
    version: '1.0.0',
    workflow: 'must-have',
    type: 'skill',
    description:
      'Interviews the user relentlessly about a plan or design until reaching shared understanding. Walks down each branch of the decision tree, resolving dependencies one by one. Provides recommended answers for each question. One question at a time.',
  },

  // Content
  {
    name: 'sync-web-content-writer',
    version: '1.0.0',
    workflow: 'content',
    type: 'skill',
    description:
      'Writes and optimizes static web pages (homepages, service pages, about pages, landing pages, FAQ, portfolio). Optimized for both Google ranking and AI agent discoverability (ChatGPT Browse, Perplexity, Claude, Google AI Overviews). Reads intake.md and applies SEO layer.',
  },
  {
    name: 'sync-article-writer',
    version: '1.0.0',
    workflow: 'content',
    type: 'skill',
    description:
      'Writes and optimizes blog posts and articles (how-to guides, listicles, opinion, pillar content, news). Google ranking and AI agent discoverability focused. Identifies article type, reads framework, and applies SEO layer.',
  },
  {
    name: 'sync-content-strategist',
    version: '1.0.0',
    workflow: 'content',
    type: 'skill',
    description:
      'Two modes: Audit/Rewrite (user shares existing copy or URL for improvement) or Strategy (what to write, fix, or prioritize). Audits for SEO and AI readability, rewrites flagged sections, and produces strategy recommendations.',
  },
]

export const pipeline = [
  {
    id: 'sales',
    role: 'Sales',
    color: 'blue',
    artifacts: ['Discovery Brief', 'Proposal', 'Quotation'],
    skills: ['sync-client-discovery'],
  },
  {
    id: 'ba',
    role: 'Business Analysis',
    color: 'violet',
    artifacts: ['Intake Doc', 'DB Schema', 'Sprint Tasks', 'FDD'],
    skills: ['sync-project-intake', 'sync-database-designer', 'sync-sprint-planner', 'sync-final-design'],
  },
  {
    id: 'pm',
    role: 'PM / Design',
    color: 'amber',
    artifacts: ['Design Tasks', 'BE Tasks', 'FE Tasks'],
    skills: ['task-orchestrator', 'sync-design-to-stories'],
  },
  {
    id: 'engineering',
    role: 'Engineering',
    color: 'emerald',
    artifacts: ['Session Summary', 'Swagger YAML', 'Compliance Report'],
    skills: ['sync-dev-session', 'sync-dev-tdd'],
  },
  {
    id: 'qa',
    role: 'QA',
    color: 'rose',
    artifacts: ['QA Run Log', 'GitHub Issues'],
    skills: ['sync-qa-runner', 'sync-qa-to-ticket'],
  },
  {
    id: 'content',
    role: 'Content',
    color: 'orange',
    artifacts: ['Web Pages', 'Articles', 'Content Strategy'],
    skills: ['sync-web-content-writer', 'sync-article-writer'],
  },
]

export const roleMapping = [
  { role: 'Sales Rep', workflows: ['sales'] },
  { role: 'Business Analyst', workflows: ['ba'] },
  { role: 'Designer / PM', workflows: ['pm'] },
  { role: 'Frontend Developer', workflows: ['pm', 'engineering'] },
  { role: 'Backend Developer', workflows: ['pm', 'engineering'] },
  { role: 'QA Tester', workflows: ['qa'] },
  { role: 'Content Writer', workflows: ['content'] },
  { role: 'All Roles', workflows: ['sales', 'ba', 'pm', 'engineering', 'qa', 'content'] },
]
