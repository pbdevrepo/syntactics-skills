# Extraction Rules

## Where to Find Modules in a PDF

- Section headers -> usually a module
- Named screens ("the login screen", "the admin panel") -> each = one module
- Named reports or exports -> each = one module
- Feature bullet lists under a header -> features of that module
- User flows ("user does X, then Y") -> X and Y may be separate modules
- Out-of-scope mentions -> note separately; clarifies what IS in scope

## Classification

| What You See | What It Is |
|---|---|
| Named screen or page | Module |
| Named report or export | Module |
| Role with unique capabilities | Module or sub-module |
| "Also includes..." / "as well as..." | Feature of preceding module |
| Vague verb ("manage", "handle", "track") | Ambiguous - flag it |
| Third-party integration | Module |
| Notification or email trigger | Module or sub-feature - clarify |

## Always-Inferred Modules

Add these as `Inferred` if not explicitly named:

| Module | Infer When |
|---|---|
| User Authentication | Any system with login |
| User Management | Any system with multiple roles |
| Settings / Config | Any system with customizable behavior |
| Audit Log | Any system where history matters |
| Notifications | Any mention of alerts, emails, reminders |
| Dashboard | Any system with a home screen for logged-in users |

## Flag as Ambiguous If

- Name given, behavior not described
- Multiple behaviors under one vague name ("Reports" with no detail)
- "Similar to [other system]" with no actual description
- Unclear which role owns it
- Appears in two sections with contradictory descriptions

Ambiguous -> becomes a clarifying question in Phase 3.

## Multi-Document Input

1. Proposal / brief = primary scope
2. Supporting docs = clarifications or additions
3. Contradiction between docs -> flag as gap, do not silently resolve
4. Supporting doc adds scope not in primary document -> add as `Inferred`, note the source
