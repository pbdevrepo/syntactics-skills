# Question Bank

Pick only what the input does not answer. Not a checklist. **Aim for 5-10 questions max (never >15).** Prioritize: ambiguous modules first, then missing role definitions, then business rules.

## Modules & Scope

- Q-MS1: What does "[Module]" include - what can a user do in it?
- Q-MS2: Is "[Module]" one screen or multiple screens?
- Q-MS3: Is "[feature]" in scope for v1 or a future phase?
- Q-MS4: "[X]" and "[Y]" appear separately - one module or two?
- Q-MS5: Are there modules discussed verbally that are not in the brief/proposal?
- Q-MS6: Does [module] support bulk actions / search / pagination?

## User Roles

- Q-UR1: How many distinct user roles does the system have?
- Q-UR2: What can [Role A] do that [Role B] cannot?
- Q-UR3: Can a user have more than one role?
- Q-UR4: Who creates user accounts - client admin or Syntactics during onboarding?
- Q-UR5: Are roles fixed or customizable per client?

## Business Rules

- Q-BR1: What triggers [notification / status change / action]?
- Q-BR2: What are the valid status transitions for [entity]?
- Q-BR3: Can a [status] be reversed once set?
- Q-BR4: What happens to related records when [entity] is deleted?
- Q-BR5: Are there approval workflows - who approves what?
- Q-BR6: Are there time-based rules (expiry, auto-archive, scheduled triggers)?
- Q-BR7: What data is required vs. optional when creating [entity]?
- Q-BR8: How is [field] calculated?

## Data & Integrations

- Q-DI1: Does the system need to connect to any existing software the client already uses?
- Q-DI2: Which payment gateway should be used - Stripe, PayPal, PayMongo, or other?
- Q-DI3: Should email/SMS notifications be sent, and through which provider?
- Q-DI4: Is there an existing API the system must integrate with?
- Q-DI5: Should data sync with any accounting, CRM, or ERP system?
- Q-DI6: What data is being migrated from an existing system?
- Q-DI7: Import/export needed? What format - CSV, PDF, Excel?
- Q-DI8: Where is data hosted - client server, cloud, Syntactics-managed?

## Technical

- Q-TC1: Any preferred tech stack from the client?
- Q-TC2: Browser or device requirements - mobile, tablet, specific OS?
- Q-TC3: Performance targets - concurrent users, load?
- Q-TC4: Compliance requirements - GDPR, HIPAA, government standards?
- Q-TC5: Existing codebase this connects to or replaces?

## Timeline

- Q-TL1: Hard go-live deadline?
- Q-TL2: Phased delivery or single release?
- Q-TL3: Who signs off on design? Who signs off on UAT?
- Q-TL4: Has the client approved the proposal or is it still draft?

## Ambiguous or Inferred Modules

- Q-AM1: The input implies [module] but does not describe it - is this in scope?
- Q-AM2: I inferred [feature] from [context] - confirm in scope or mark out of scope.
- Q-AM3: "[Term]" - does this mean [interpretation A] or [interpretation B]?
