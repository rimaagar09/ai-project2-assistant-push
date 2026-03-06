---
name: pm-pipeline
description: >
  Project Management - PSV · Combined Delivery Pipeline Skill.
  Triggers: "create BRD", "run discovery", "generate Jira", "PM pipeline", "PSV project",
  "update confluence", "prefill discovery dashboard", "generate tickets from BRD",
  "Engage+", "Marvel", "Loyalty+", "Rewards+", "Campaign Manager", "CDP", "Capillary BRD".
  This skill orchestrates the full 3-phase pipeline:
    Phase 01 → BRD Skill (agent asks structured questions; uses Capillary product knowledge)
    Phase 02 → Discovery BRD Skill (prefilled from BRD + uploaded folder; must reach 100%;
               includes Yes/No Quick Confirm section auto-answered from prefill)
    Phase 03 → Jira-BRD Skill (only unlocked when discovery is 100% complete)
  Always run phases in sequence. Gate rules must be satisfied before advancing.
  Product knowledge embedded: Engage+ (omnichannel marketing automation), Loyalty+,
  Rewards+, Campaign Manager, CDP, Marvel implementation approach, catalog promotions.
  Guardrails enforced across all phases: Scope Boundaries, Financial, Compliance/Regulatory
  (GDPR/PCI-DSS), SMART KPIs, Business Constraints, Resource & Roles.
  Key Gaps highlighted automatically after BRD is generated and again after Discovery.
---

# PM Pipeline Skill — Project Management · PSV

**End-to-End Pipeline:** BRD (Agent-Guided) → Discovery Dashboard (with Yes/No section) → Jira Tickets
**Confluence Space:** Project Management - PSV

---

## Pipeline Overview

```
[Phase 01] BRD Skill  ← Agent asks structured questions before writing
     ↓ [🛡️ Guardrail Check + Key Gaps Report — generated automatically after BRD]
     ↓ [Gate 1: BRD Approved + Guardrails Cleared]
[Phase 02] Discovery BRD Skill  ← prefilled from BRD + uploaded folder
              └── Includes: YES/NO Quick Confirm section (auto-prefilled)
              └── Includes: 🛡️ Guardrail Status Panel (live gap tracker)
     ↓ [Gate 2: Discovery 100% complete + all Guardrail gaps resolved]
[Phase 03] Jira-BRD Skill
     ↓
[Output] Live Jira Board · Confluence Docs Updated
```

---

## Confluence Folder Structure

```
📁 Project Management - PSV  (Root)
 ├── 📋 BRD Documents
 │    ├── [Client]_BRD_v1.0.docx          ← Phase 01 output
 │    ├── [Client]_BRD_vX.X_revised.docx  ← Phase 02 updates
 │    └── BRD_Sample_Template.md          ← base template
 │
 ├── 🔍 Discovery Documents
 │    ├── [Client]_PreBRD_Discovery.html  ← Phase 02 output
 │    ├── Discovery_Signoff_Record.docx
 │    └── Open_Questions_Register.xlsx
 │
 ├── 🎯 Jira Backlog
 │    ├── [Client]_Epics_Stories.xlsx     ← Phase 03 output
 │    ├── [Client]_Jira_Import.csv
 │    └── Sprint_Plan.xlsx
 │
 ├── 👥 Stakeholder Docs
 │    ├── Stakeholder_Matrix.docx
 │    ├── Sign_Off_Record.docx
 │    └── Meeting_Notes.docx
 │
 └── ⚙️ Integration & Config
      ├── Integration_Specs.docx
      ├── Config_Mapping.xlsx
      └── POS_Flow_Diagram.pdf
```

**Naming convention:**
- BRD files → `[ClientName]_BRD_v1.0.docx`
- Discovery files → `[ClientName]_PreBRD_Discovery.html`
- Jira exports → `[ClientName]_Jira_Import.csv` / `.xlsx`
- All docs version-controlled with date suffix on revision

---

## PHASE 01 — BRD Creation (Agent-Guided)

### ⚡ AGENT QUESTION PROTOCOL — Run This BEFORE Writing the BRD

Before generating any BRD content, the agent MUST ask the following structured questions. Present them conversationally in grouped sets — do not overwhelm with all at once.

#### Question Set A — Project Identity
Ask all of these upfront:
1. **Client / Brand name?** (e.g. Marvel, Acme Retail)
2. **Project name or programme name?** (e.g. "Marvel Loyalty Relaunch", "Acme Points Programme")
3. **Which Capillary modules are in scope?** (show the list below and let them select)
4. **What is the core business problem this project solves?** (1–3 sentences)
5. **What are the top 3 business objectives?** (e.g. increase repeat purchase, reduce churn, grow app engagement)
6. **Target go-live date or timeline?** (even a rough quarter is fine)

**Module selection list to show:**
```
[ ] Loyalty+          [ ] Campaign Manager    [ ] Rewards+
[ ] Engage+           [ ] CDP                 [ ] Mobile App
[ ] APIs / POS        [ ] LINE Integration    [ ] Insights+
[ ] Neo (custom)      [ ] Vulcan (custom UI)  [ ] Connect+ (batch data)
```

#### Question Set B — Scope Clarification
Ask these after Set A is answered:
7. **Is this a new programme build or an enhancement/migration of an existing one?**
8. **What channels will be used for customer communication?** (SMS, Email, WhatsApp, Push, In-App, LINE, Viber, RCS, Zalo, Call Task — select all that apply)
9. **Will there be POS integration?** If yes: Which POS system/vendor?
10. **Is there a mobile app?** If yes: iOS / Android / React Native / Flutter?
11. **How many tiers in the loyalty programme?** (e.g. Silver / Gold / Platinum; or JPS / JPS+ / JPSX)
12. **Are there any known third-party integrations?** (e.g. ERP, payment gateway, partner brands)
13. **Is there a phased delivery?** If yes: what is in Phase 1 vs later phases?

#### Question Set C — Engage+ Specific (ask if Engage+ is in scope)
14. **Which Engage+ channel credentials are already set up or need to be configured?**
    (DLT/SMS, SendGrid/Email, WhatsApp BSP, Firebase/Push, LINE OA, etc.)
15. **What customer lifecycle journeys are required?**
    (Welcome, First Purchase, Birthday, Win-Back, Tier Upgrade, Points Expiry, Post-Purchase, Cart Abandonment, Churn Prevention — select all)
16. **Will Liquid personalisation be used?** (conditional content, dynamic product loops)
17. **Is Audience FTP Connector needed?** (for recurring campaigns with external audience refresh)
18. **What campaign types are planned?** (Broadcast, Recurring, Journey, Referral, DVS, Bounceback, Ads Audience)

#### Question Set D — Rewards+ / Catalog Promotions (ask if Rewards+ is in scope)
19. **What reward types will be in the catalogue?** (Vouchers, Merchandise, Experiences, Partner Rewards, Charity)
20. **Is points+cash (split tender) redemption required?**
21. **Are there tier-exclusive rewards?** (e.g. JPSX-only items)
22. **Are Cart Promotions required?** (auto-apply discount at POS/checkout based on basket conditions)
23. **Are Catalog Promotions required?** (item-level discounts, combo deals, product-specific promotions in the Rewards catalog)
    - If yes: define promotion types: percentage discount, fixed value, BOGO, bundle offer
    - Define qualifying conditions: minimum basket value, specific SKUs, product categories, combo purchases
    - Define fraud prevention: Cart Locking enabled? Duplicate redemption prevention rules?

#### Question Set E — Marvel / Advanced Configurations (ask if relevant)
24. **Is Neo (custom dataflow logic) required?** If yes: describe the custom business rule
25. **Is Vulcan (custom UI) required?** If yes: describe the custom UI component
26. **Are Behavioral Events to be tracked?** (app opens, cart adds, QR scans, game plays, form fills)
27. **Is gamification in scope?** (Badges, Streaks, Milestones, Games integration — CataBoom / CustomerGlu)
28. **Is a Referral Programme required?**
29. **Is a Partner/Coalition programme required?**
30. **What data export / BI integration is needed?** (Power BI, Tableau, SFTP exports, Databricks)

> **Agent Rule:** If the user says "just start" or provides a doc — extract answers from it and only ask for what is missing. Do not repeat questions already answered. Always confirm extracted answers before proceeding.

---

### BRD Document Structure

Generate a complete BRD with ALL of the following sections. Populate using the answers from the agent question protocol above plus the Capillary product knowledge in this skill.

```
1.  Document Control
    - Project Name, Client, Version, Date, Author, Status, Reviewers

2.  Executive Summary
    - Programme overview (3–5 sentences)
    - Business problem being solved
    - Expected outcomes / success metrics

3.  Business Objectives
    - Primary objectives (revenue, engagement, retention, acquisition)
    - KPI targets where known

4.  Current State Analysis (As-Is)
    - Existing programme / system state
    - Pain points and gaps

5.  Proposed Solution (To-Be)
    - Capillary module mapping table (module → purpose → key config)
    - Solution architecture overview

6.  Scope Definition
    - In-scope modules and features
    - Out-of-scope (explicitly stated)
    - Assumptions and constraints

7.  Functional Requirements (FR-XXX)
    - Grouped by module
    - 6-column table: Req ID | Module | Description | Business Logic | Priority | Dependency
    - Every FR has at least 1 acceptance criterion
    - Priority: Must Have / Should Have / Nice to Have
    - Phase tag: Phase 1 / Phase 2 / Phase 3

8.  Non-Functional Requirements (NFR-XXX)
    - Performance, security, scalability, reliability
    - Measurable targets (e.g. "< 3 sec response at p95", "≥ 99.5% uptime")

9.  Integration Requirements
    - POS integration spec
    - API endpoints required
    - Connect+ dataflow requirements
    - Mobile SDK integration
    - Third-party system connections

10. User Journeys / Process Flows
    - Member registration flow
    - Points earn and redeem flow
    - Campaign / Journey trigger flows
    - Engage+ channel flows
    - Rewards catalog redemption flow

11. Implementation Phases & Milestones

12. Project Timelines

13. Risks & Mitigation
    ─── [Section 14 below is ALWAYS present] ───
14. End-to-End Member Journey Flow  ← MANDATORY visual diagram (generated via Python + Pillow)
    ─────────────────────────────────────────────

15. KPIs & Success Metrics

16. Acceptance Criteria Summary

17. Commercial Considerations

18. Clarification Register

19. Appendix
```

### Requirement ID Convention
- Functional Requirements: `FR-001`, `FR-002`, ...
- Non-Functional Requirements: `NFR-001`, `NFR-002`, ...

### BRD Quality Rules
- Every FR must have at least 1 acceptance criterion
- Every module/feature must have at least 1 FR
- NFRs must have measurable targets
- Priority set on every requirement
- Phase tagging applied to every requirement
- Capillary module mapping table present in Section 5

### Save the BRD
1. Read `/mnt/skills/public/docx/SKILL.md` to generate properly formatted `.docx`
2. Generate Member Journey Flow PNG using Python + Pillow (see capillary-brd SKILL.md Step 3)
3. Save as `[ClientName]_BRD_v1.0.docx`
4. Present it to the user via `present_files`
5. **Immediately run the Guardrail Check + Key Gaps Report** (see full spec below)
6. Ask: **"BRD is ready! Guardrail report generated above. Shall I now run the Discovery Dashboard and pre-fill it from this BRD?"**

---

## 🛡️ BRD GUARDRAIL FRAMEWORK

### Purpose
After every BRD is generated, the agent MUST automatically run a **Guardrail Check** and produce a **Key Gaps Report**. This runs in two places:
- **After Phase 01** — immediately after BRD is generated (before Gate 1)
- **After Phase 02** — embedded as a live status panel in the Discovery Dashboard

The Guardrail Check evaluates the BRD against 6 mandatory guardrail categories. Any unresolved guardrail issue is a **gap** that must be assigned an owner and resolution date before Phase 03.

---

### 🛡️ GUARDRAIL CATEGORY 1 — Scope Boundaries

**Purpose:** Prevent scope creep. Clearly define what is in vs. out of scope.

**Agent checks:**
- [ ] In-scope modules explicitly listed (Loyalty+, Engage+, etc.)
- [ ] Out-of-scope items explicitly stated (e.g. "e-commerce integration — Phase 2", "LINE — not in scope")
- [ ] Phase boundaries defined (what is Phase 1 vs Phase 2 vs Phase 3)
- [ ] No open-ended phrases like "TBD", "to be confirmed", "as agreed" in the scope section
- [ ] Change control process defined (how scope changes will be handled)
- [ ] Feature freeze date documented

**Gap flags to raise:**
```
🔴 CRITICAL GAP — Scope: Out-of-scope section is empty or missing
🟡 RISK — Scope: [X] requirements have no phase tag — risk of scope creep
🟡 RISK — Scope: Change control process not defined
🟠 WARNING — Scope: [X] items marked TBD — must be resolved before Gate 2
```

---

### 🛡️ GUARDRAIL CATEGORY 2 — Financial Guardrails

**Purpose:** Set budgetary thresholds, funding limits, contingency requirements.

**Agent checks:**
- [ ] Project budget documented (even a range or "TBD with owner assigned")
- [ ] Commercial model defined (licence fee, implementation fee, rev share — whichever applies)
- [ ] Contingency budget % defined (recommended: 10–15% of total project budget)
- [ ] Cost overrun escalation threshold defined (e.g. "PM notified at 10% overrun; Sponsor at 20%")
- [ ] Funding approval signatory identified
- [ ] Commercial Considerations section (Section 17) populated

**Gap flags to raise:**
```
🔴 CRITICAL GAP — Financial: Budget not documented — owner must be assigned
🔴 CRITICAL GAP — Financial: Funding approval authority not identified
🟡 RISK — Financial: No contingency budget defined
🟠 WARNING — Financial: Commercial Considerations section is empty
```

---

### 🛡️ GUARDRAIL CATEGORY 3 — Compliance & Regulatory

**Purpose:** Non-negotiable legal and industry standards the implementation must adhere to.

**Agent checks — run these for EVERY BRD regardless of client:**

*Data Privacy:*
- [ ] **GDPR** (if EU customers or EU data processing) — documented Yes/No
- [ ] **PDPA** (Personal Data Protection Act — Thailand, Singapore, etc.) — documented Yes/No
- [ ] **DPDP** (India Digital Personal Data Protection Act 2023) — documented Yes/No
- [ ] Regional privacy law applicable to client's markets — identified and documented
- [ ] Customer consent / opt-in flows defined for all communication channels
- [ ] Data retention periods documented
- [ ] Right to erasure / data deletion workflow defined
- [ ] PII (Personally Identifiable Information) fields tagged in data model
- [ ] PSI (Payment Sensitive Information) fields tagged

*Payment & Transaction Security:*
- [ ] **PCI-DSS** compliance required? (if handling card data) — documented Yes/No
- [ ] Card data handled by Capillary platform? If yes — PCI scope defined
- [ ] Tokenisation of card data confirmed

*Industry-Specific:*
- [ ] Any sector-specific regulation applicable? (HIPAA for health, FCA for fintech, etc.) — documented
- [ ] DLT registration (India SMS) — documented if India is in scope
- [ ] WhatsApp Meta template approval timeline accounted for in project plan

*Fraud Controls:*
- [ ] Fraud detection rules documented
- [ ] OTP verification rules documented
- [ ] Cart Locking (if Cart/Catalog Promotions in scope) — documented

**Gap flags to raise:**
```
🔴 CRITICAL GAP — Compliance: GDPR/PDPA/DPDP applicability not assessed
🔴 CRITICAL GAP — Compliance: Customer consent/opt-in flows not defined
🔴 CRITICAL GAP — Compliance: PII/PSI field tagging not documented
🔴 CRITICAL GAP — Compliance: PCI-DSS scope not assessed
🟡 RISK — Compliance: Data retention periods not documented
🟡 RISK — Compliance: DLT registration not mentioned (India market detected)
🟡 RISK — Compliance: WhatsApp Meta template approval timeline not in project plan
🟠 WARNING — Compliance: Right to erasure workflow not defined
```

---

### 🛡️ GUARDRAIL CATEGORY 4 — Success Metrics (SMART KPIs)

**Purpose:** All KPIs must be SMART — Specific, Measurable, Achievable, Relevant, Time-bound.

**Agent checks:**
- [ ] At least 5 KPIs defined (mix of programme health, engagement, financial)
- [ ] Each KPI has a **baseline** (current state value) or "baseline to be measured at launch"
- [ ] Each KPI has a **target** with a specific number (not "improve" or "increase")
- [ ] Each KPI has a **time horizon** (e.g. "by end of Q2 2025", "within 6 months of go-live")
- [ ] KPIs cover all in-scope modules (not just loyalty — also Engage+, Rewards+, etc.)
- [ ] Measurement methodology defined (how will each KPI be tracked — which report, which dashboard)
- [ ] KPI owner assigned

**Required KPI categories — flag if any missing:**

| Category | Example KPI |
|----------|-------------|
| Programme Enrolment | "X% of total customers enrolled in loyalty programme within 90 days of launch" |
| Active Member Rate | "X% of enrolled members transacted at least once in the last 30 days" |
| Points Liability | "Points liability not to exceed X% of total revenue" |
| Engagement / Channels | "Email open rate ≥ X%; Push delivery rate ≥ X%" |
| Campaign ROI | "Incremental sales lift ≥ X% vs control group" |
| Redemption Rate | "X% of earned points redeemed within 12 months" |
| Tier Upgrade Rate | "X% of Silver members upgrade to Gold within 6 months" |
| App Engagement | "DAU/MAU ratio ≥ X%; session length ≥ X minutes" |
| Customer Retention | "Repeat purchase rate ≥ X% among loyalty members" |
| NPS / CSAT | "Programme NPS ≥ X at 3-month post-launch survey" |

**Gap flags to raise:**
```
🔴 CRITICAL GAP — KPIs: Fewer than 5 KPIs defined
🔴 CRITICAL GAP — KPIs: [KPI name] has no measurable target — not SMART
🔴 CRITICAL GAP — KPIs: No time-bound horizon on [X] KPIs
🟡 RISK — KPIs: No KPIs defined for [module name] which is in scope
🟡 RISK — KPIs: Measurement methodology not defined for [KPI name]
🟠 WARNING — KPIs: Baseline values missing — recommend measuring at launch
```

---

### 🛡️ GUARDRAIL CATEGORY 5 — Business Constraints

**Purpose:** Identify and document operational limitations, legacy dependencies, and hard deadlines.

**Agent checks:**
- [ ] Legacy system dependencies documented (existing CRM, POS vendor, ERP — name and version)
- [ ] Hard deadlines identified and documented (regulatory, commercial, seasonal — e.g. "must go live before Ramadan campaign")
- [ ] Known technical constraints documented (e.g. POS system cannot be upgraded, only API push available)
- [ ] Data migration constraints documented (if migrating from existing programme — member data, points balances, transaction history)
- [ ] Dependency on third-party approvals documented (e.g. WhatsApp Meta approval, DLT registration)
- [ ] Operational constraints documented (e.g. blackout periods, store maintenance windows)
- [ ] Team availability constraints (e.g. "client team unavailable during festive season")
- [ ] Parallel run requirements (old and new system running simultaneously — duration defined)

**Gap flags to raise:**
```
🔴 CRITICAL GAP — Constraints: Legacy system dependencies not documented
🔴 CRITICAL GAP — Constraints: Hard deadline present but not documented in BRD
🟡 RISK — Constraints: Data migration scope (member/points balances) not defined
🟡 RISK — Constraints: Third-party approval timelines (WhatsApp/DLT) not in project plan
🟠 WARNING — Constraints: Parallel run / cutover strategy not defined
🟠 WARNING — Constraints: Operational blackout periods not identified
```

---

### 🛡️ GUARDRAIL CATEGORY 6 — Resource & Roles

**Purpose:** Clear ownership, decision authority, and accountability for every workstream.

**Agent checks:**
- [ ] Capillary project team roles identified: PM, BA, Tech Lead, Implementation Consultant, QA
- [ ] Client team roles identified: Project Sponsor, BPO, Tech Lead, Marketing Owner, IT Contact
- [ ] RACI matrix defined or referenced (who is Responsible / Accountable / Consulted / Informed per workstream)
- [ ] Decision-making authority documented (who can approve scope changes, budget increases, go/no-go decisions)
- [ ] Escalation path documented (PM → Sponsor → Steering Committee)
- [ ] Sign-off authority for each deliverable identified (BRD sign-off, UAT sign-off, Go-Live sign-off)
- [ ] Communication cadence defined (weekly status, steering committee frequency)
- [ ] Key contact list populated in Document Control

**Gap flags to raise:**
```
🔴 CRITICAL GAP — Roles: Client project sponsor not identified
🔴 CRITICAL GAP — Roles: No sign-off authority defined for BRD / UAT / Go-Live
🟡 RISK — Roles: RACI matrix missing — risk of accountability gaps
🟡 RISK — Roles: Escalation path not documented
🟠 WARNING — Roles: Capillary internal team assignments not confirmed
🟠 WARNING — Roles: Communication cadence not defined
```

---

### 📋 KEY GAPS REPORT — Output Format

After running all 6 guardrail checks, the agent produces a **Key Gaps Report** in the following format. This is always shown immediately after the BRD is presented and again as a section in the Discovery Dashboard.

```
═══════════════════════════════════════════════════════
📋 KEY GAPS REPORT — [Client Name] BRD v1.0
Generated: [Date]
═══════════════════════════════════════════════════════

SUMMARY
────────────────────────────────────────────────────────
  🔴 Critical Gaps:    [N]   ← Must resolve before Gate 1
  🟡 Risk Items:       [N]   ← Must resolve before Gate 2
  🟠 Warnings:         [N]   ← Should resolve; can proceed with owner assigned
  ✅ Guardrails Passed: [N]/6
────────────────────────────────────────────────────────

🔴 CRITICAL GAPS (must resolve before BRD sign-off)
──────────────────────────────────────────────────────
  [G1-001] Scope: Out-of-scope section is empty
           → Owner: [TBD]   Due: [Date]   Status: OPEN

  [G3-001] Compliance: GDPR/PDPA applicability not assessed
           → Owner: [TBD]   Due: [Date]   Status: OPEN

  [G4-001] KPIs: Fewer than 5 KPIs defined (currently 2)
           → Owner: [TBD]   Due: [Date]   Status: OPEN

🟡 RISK ITEMS (resolve before Discovery Gate 2)
──────────────────────────────────────────────────────
  [G2-001] Financial: No contingency budget defined
           → Owner: [TBD]   Due: [Date]   Status: OPEN

  [G5-001] Constraints: Data migration scope not defined
           → Owner: [TBD]   Due: [Date]   Status: OPEN

  [G6-001] Roles: RACI matrix missing
           → Owner: [TBD]   Due: [Date]   Status: OPEN

🟠 WARNINGS (assign owner; can proceed)
──────────────────────────────────────────────────────
  [G3-002] Compliance: WhatsApp Meta approval timeline not in project plan
           → Owner: [TBD]   Due: [Date]   Status: OPEN

  [G5-002] Constraints: Parallel run / cutover strategy not defined
           → Owner: [TBD]   Due: [Date]   Status: OPEN

✅ GUARDRAIL CATEGORIES PASSED
──────────────────────────────────────────────────────
  ✅ G1 — Scope Boundaries:       PASSED
  ❌ G2 — Financial Guardrails:   2 gaps
  ❌ G3 — Compliance/Regulatory:  2 gaps
  ❌ G4 — Success Metrics (KPIs): 1 gap
  ✅ G5 — Business Constraints:   PASSED
  ❌ G6 — Resource & Roles:       1 gap

ACTION REQUIRED
──────────────────────────────────────────────────────
  • Assign owners for all 🔴 Critical Gaps before requesting BRD sign-off
  • 🟡 Risk Items must be resolved before Discovery Gate 2
  • Add resolved items to the Clarification Register (Section 18)
  • Re-run Guardrail Check after updates → target: 6/6 PASSED
═══════════════════════════════════════════════════════
```

---

### Guardrail IDs Convention
- `G1-XXX` = Scope Boundaries
- `G2-XXX` = Financial Guardrails
- `G3-XXX` = Compliance & Regulatory
- `G4-XXX` = KPIs / Success Metrics
- `G5-XXX` = Business Constraints
- `G6-XXX` = Resource & Roles

---

### Guardrail Re-Run Rule
The agent re-runs the guardrail check automatically whenever:
1. The BRD is updated (new version vX.X)
2. Discovery Dashboard reaches 100%
3. User requests "re-check guardrails" or "run gaps report"

All resolved gaps must be documented in the **Clarification Register (BRD Section 18)** with the resolution text and approver name.

---

### Guardrail Status in Discovery Dashboard

The Discovery Dashboard (Phase 02 HTML output) includes a **"🛡️ Guardrail Status"** tab showing:
- Live status of all 6 guardrail categories (✅ Passed / ❌ Open gaps / 🔄 In Progress)
- Each gap as a card with: gap ID, description, owner field, due date picker, status dropdown (Open / In Progress / Resolved / Waived)
- Overall guardrail score: "X/6 categories cleared"
- A "Guardrail Scorecard" exportable as `.txt` for Confluence upload
- Gate 2 is visually locked until all 🔴 Critical Gaps are resolved and all 🟡 Risk Items are either Resolved or formally Waived with an approver named

---

### Gate 1 — Required before Phase 02
- [ ] All 19 BRD sections populated (no placeholders)
- [ ] Guardrail Key Gaps Report generated and shared with stakeholders
- [ ] All 🔴 Critical Gaps resolved (or formally waived with named approver)
- [ ] BRD reviewed by client BPO / project sponsor
- [ ] Sign-off record saved to Confluence › Stakeholder Docs
- [ ] BRD version confirmed as v1.0 Approved

---

## PHASE 02 — Discovery & Prefill (with Yes/No Quick Confirm section)

**Input:** BRD v1.0 (approved) + attached folder files
**Output folder:** Confluence › Discovery Documents

### Steps
1. Read the approved BRD to extract known answers
2. Extract context from attached folder files
3. Build the Pre-BRD Discovery Dashboard HTML
4. **Prefill** all questions answerable from the BRD and attached files:
   - Mark pre-answered items: `(From BRD: "...")`
   - Mark items from folder data: `(From uploaded doc: "...")`
5. **Build the Yes/No Quick Confirm section** (see spec below)
6. Flag remaining Must-Have questions that need stakeholder input
7. Run discovery session until dashboard reaches **100% completion**
8. Export `.txt` summary and upload to Confluence › Discovery Documents

---

### 🆕 YES/NO QUICK CONFIRM SECTION — Specification

This is a NEW section added to every Discovery Dashboard. It appears as a dedicated tab or collapsible panel labelled **"✅ Quick Confirm — Yes / No"** and contains binary confirmation questions derived from the BRD content.

#### Purpose
- Speed up discovery for questions that are already implicitly answered in the BRD
- Give stakeholders a fast review mechanism (thumbs up / thumbs down per item)
- Automatically mark these as "confirmed" once answered — they count toward the 100% completion score

#### How to build it
1. Parse the BRD for every configuration decision, integration assumption, and scope item
2. Convert each into a binary Yes/No question
3. **Pre-answer each question based on BRD content** — set the toggle to Yes or No with a source hint
4. Flag any where the BRD is ambiguous — mark as "Needs Confirmation ❓"

#### Question categories and examples

**Programme Structure**
- "Is this a points-based loyalty programme?" → [Yes / No] *(From BRD: "1 point per THB 25 spend")*
- "Does the programme have tiered membership?" → [Yes / No] *(From BRD: "Silver / Gold / Platinum tiers")*
- "Are tier benefits different per tier?" → [Yes / No]
- "Is there a welcome bonus for new members?" → [Yes / No]
- "Does the programme support points expiry?" → [Yes / No]
- "Is points pooling (family/group) required?" → [Yes / No]

**Engage+ Channel Confirmation**
- "Is SMS required as a communication channel?" → [Yes / No] *(From BRD scope)*
- "Is Email required?" → [Yes / No]
- "Is WhatsApp required?" → [Yes / No]
- "Is Push Notification required?" → [Yes / No]
- "Is In-App Messaging required?" → [Yes / No]
- "Is LINE required?" → [Yes / No]
- "Is channel priority fallback configured?" → [Yes / No]
- "Is DLT registration required?" (India only) → [Yes / No]
- "Is Liquid personalisation required?" → [Yes / No]
- "Is the Unsubscribe / consent management flow required?" → [Yes / No]

**Campaign & Journey Confirmation**
- "Is a Welcome Journey required?" → [Yes / No]
- "Is a Birthday/Anniversary Journey required?" → [Yes / No]
- "Is a Win-Back Journey required?" → [Yes / No]
- "Is a Points Expiry reminder journey required?" → [Yes / No]
- "Is a Tier Upgrade notification journey required?" → [Yes / No]
- "Is a Post-Purchase journey required?" → [Yes / No]
- "Are Recurring campaigns required?" → [Yes / No]
- "Is Test & Control split required on campaigns?" → [Yes / No]
- "Are Referral campaigns required?" → [Yes / No]

**Engage+ Incentives**
- "Are Coupons / Offer series required via Engage+?" → [Yes / No]
- "Is Bonus Points issuance via campaigns required?" → [Yes / No]
- "Are Gift Vouchers required?" → [Yes / No]
- "Are DVS (Dynamic Voucher System) campaigns required?" → [Yes / No]
- "Are Badges required in campaigns/journeys?" → [Yes / No]
- "Are Cart Promotions required?" → [Yes / No]

**Rewards+ / Catalog Promotions**
- "Is a Rewards Catalog required?" → [Yes / No]
- "Are tier-exclusive rewards required?" → [Yes / No]
- "Is points+cash split tender required?" → [Yes / No]
- "Are Partner Rewards required?" → [Yes / No]
- "Are Catalog Promotions required?" → [Yes / No]
  - If Yes → "Are percentage discount promotions required?" → [Yes / No]
  - If Yes → "Are fixed-value discount promotions required?" → [Yes / No]
  - If Yes → "Are BOGO (Buy One Get One) promotions required?" → [Yes / No]
  - If Yes → "Are bundle/combo promotions required?" → [Yes / No]
  - If Yes → "Is Cart Locking (fraud prevention) required?" → [Yes / No]

**Integration & Data**
- "Is POS integration required?" → [Yes / No]
- "Is a Mobile App integration required?" → [Yes / No]
- "Is Connect+ batch data ingestion required?" → [Yes / No]
- "Is an SFTP data feed required?" → [Yes / No]
- "Is historical data migration required?" → [Yes / No]
- "Is Behavioral Event tracking required?" → [Yes / No]
- "Is Neo (custom logic) required?" → [Yes / No]
- "Is Vulcan (custom UI) required?" → [Yes / No]
- "Is Insights+ / BI reporting required?" → [Yes / No]
- "Is Databricks / Power BI integration required?" → [Yes / No]

**UAT & Go-Live**
- "Is a UAT environment required before production go-live?" → [Yes / No]
- "Is staging environment available?" → [Yes / No]
- "Is phased go-live planned?" → [Yes / No]
- "Is a pilot / soft launch planned?" → [Yes / No]

#### UI/UX Spec for Yes/No section
```html
<!-- Each row renders as: -->
<div class="yn-row">
  <span class="yn-question">Is SMS required as a communication channel?</span>
  <span class="yn-hint">(From BRD: "SMS listed as primary channel")</span>
  <button class="yn-btn yn-yes active">✅ Yes</button>
  <button class="yn-btn yn-no">❌ No</button>
  <span class="yn-status confirmed">Confirmed</span>
</div>

<!-- For ambiguous items: -->
<div class="yn-row yn-needs-confirm">
  <span class="yn-question">Is LINE integration required?</span>
  <span class="yn-hint">❓ Not mentioned in BRD — needs stakeholder input</span>
  <button class="yn-btn yn-yes">✅ Yes</button>
  <button class="yn-btn yn-no">❌ No</button>
  <span class="yn-status pending">Needs Confirmation</span>
</div>
```

#### Scoring rules
- Pre-answered Yes/No items (from BRD): count as **50% confirmed** until stakeholder clicks to confirm
- Stakeholder-confirmed Yes/No items: count as **100% confirmed**
- Ambiguous items needing input: count as **0%** until answered
- The Yes/No section contributes to the overall discovery completion score

---

### What "100% complete" means
- All `must` priority questions answered (status ≠ Pending)
- All Yes/No Quick Confirm items confirmed (no "Needs Confirmation ❓" remaining)
- At least 1 module selected in Solution tab
- BRD Section Coverage Map: all 19 sections ≥ partial
- Blocker strip cleared (no outstanding Must-Have items)
- Open Questions Register: all items have owner + due date

### Gate 2 — Required before Phase 03
- [ ] Discovery dashboard: 100% Must-Have completion
- [ ] Yes/No Quick Confirm section: 100% confirmed (no pending items)
- [ ] **Guardrail Status: all 🔴 Critical Gaps resolved + all 🟡 Risk Items resolved or formally waived**
- [ ] **Guardrail Scorecard exported and saved to Confluence › Discovery Documents**
- [ ] BRD updated to reflect any new information (vX.X)
- [ ] Discovery export `.txt` saved to Confluence
- [ ] Open Questions Register cleared or formally TBD'd with owners

---

## PHASE 03 — Jira Ticket Creation (Jira-BRD Skill)

**Input:** Approved BRD (100% discovery complete)
**Output folder:** Confluence › Jira Backlog
**Project Key:** PSV

> ⚠️ This phase is LOCKED until Gate 2 is cleared.

### Steps
1. Use approved BRD as source of truth
2. Call Jira API to discover project field configuration:
   - `getAccessibleAtlassianResources` → cloudId
   - `getVisibleJiraProjects` → confirm PSV project
   - `getJiraIssueTypeMetaWithFields` → required fields, components, priorities
3. Confirm with PM: Label, GeoRegion, Brand, Environment, Component
4. Create Epics first, then Stories linked to each Epic
5. All fields populated dynamically — no hardcoded values
6. Export CSV + XLSX to Confluence › Jira Backlog

### Ticket structure
```
Epic (per functional module)
 └── Story
      ├── [REQ-ID] Summary (< 100 chars)
      ├── User story: "As a / I want / so that"
      ├── Acceptance Criteria
      ├── Story Points (Fibonacci: 1/2/3/5/8/13)
      ├── Priority (from project — not assumed)
      ├── Label, Component, GeoRegion (from PROJECT_FIELD_MAP)
      └── Assignee, Sprint, Fix Version
```

---

## CAPILLARY PRODUCT KNOWLEDGE BASE

This section is embedded product knowledge to be used when populating BRD sections, discovery questions, and Jira tickets. Do NOT ask the client for information that is already covered here — use it to pre-fill and validate.

### Engage+ — Omnichannel Marketing Automation

**What it is:** Capillary's marketing automation solution for personalised, multi-channel campaigns. Reaches customers via Email, SMS, WhatsApp, LINE, Viber, RCS, Zalo, Push Notifications, In-App messages, and Facebook Ads.

**Key configuration steps (agent uses these to populate FR tables):**

| Step | Phase | Key Deliverable |
|------|-------|-----------------|
| 01 | Pre-requisites & Access | Org setup, user roles (Campaign Manager, Approver, Analytics Viewer, Org Admin), channel credentials |
| 02 | Audience Management | Segments, filters, reachability validated |
| 03 | Channel Configuration | All channels live and tested |
| 04 | Personalisation & Content | Labels, Liquid, templates ready |
| 05 | Incentive Management | Offers, coupons, points, vouchers configured |
| 06 | Campaign Creation | All campaign types created and approved |
| 07 | Journeys & Automation | Lifecycle journeys live |
| 08 | Testing, Approval & Go-Live | UAT sign-off, production live |
| 09 | Reporting & Optimisation | Dashboards, reports, ongoing cadence |

**Channel-specific implementation requirements to include in BRD FRs:**

*SMS:*
- Configure SMS gateway vendor in Engage+ channel settings
- India: DLT registration mandatory (Sender ID + all content templates must be pre-approved)
- Link Tracking requires a support ticket to enable
- DLT-compliant SMS in India: links must be inside `{#var#}` variable tag only

*Email:*
- Configure email vendor (SendGrid or custom SMTP): API key, sender name, sender email
- Set up DKIM and SPF records for sending domain
- Unsubscribe tag is MANDATORY for all email campaigns — cannot be sent without it
- Build custom Unsubscribe landing page URL

*WhatsApp:*
- Configure WhatsApp BSP (Business Service Provider) credentials
- Register message templates with Meta — allow time for Meta approval in project timeline
- Customers must actively opt-in for WhatsApp marketing messages
- Interactive message features: buttons, quick replies available

*Push Notifications:*
- Depends on Mobile SDK integration (Android / iOS / React Native / Flutter) as prerequisite
- Configure Firebase credentials (FCM for Android, APNs for iOS)
- PushMax fallback to in-app if push fails

*In-App Messages:*
- Configured via Mobile SDK integration
- Display triggers: on app open, after specific action, after delay, on campaign send
- Templates: modal, banner, full-screen, card

*Channel Priority:*
- Defines fallback order: e.g. WhatsApp → SMS → Email
- Both channels in a priority pair cannot be the same channel — system will reject this

**Audience Management in Engage+:**
- Loyalty-Based Filters: tier, points balance, points expiry, card series, programme membership
- Transaction-Based Filters: transaction count, value, last/first purchase date, store, product category
- User Profile-Based Filters: registration date, mobile, email, city, custom/extended fields
- Behavioural Event Filters: available once SDK/API integration is live (app opens, cart add, QR scan)
- Campaign & Coupon-Based Filters: received / opened / clicked / redeemed a specific campaign
- AI-Powered Filters: churn risk score, purchase propensity, next best offer, CLV segments
- Cart & Catalog Promotion Filters: eligible for or having interacted with cart/catalog promotions

**Audience best practices to document in BRD:**
- Always check reachability before scheduling (100K audience may only have 60K reachable)
- Test & Control splits for all major campaigns (define a Control Group to measure true incremental sales)
- For recurring campaigns: set up FTP Connector Audience; align Connect+ dataflow at least 4 hours before send
- For multi-programme clients: always set Scope filter on message creation page

**Journey Entry Triggers:**
- User Event Trigger: transactional event or Behavioural Event
- Audience Trigger: customer belongs to or joins a defined audience group
- Schedule Trigger: specific date/time or recurring schedule
- Multiple Entry Paths: different customers can enter the same journey via different paths

**Journey Building Blocks:**
- Engagement Block: send message on a specific channel
- A/B Testing Block: split customers into variants (Note: A/B block replaces engagement block — do NOT add separate engagement block alongside)
- Channel Priority Block: attempt channels in priority order based on reachability
- Time-Based Wait: pause journey for fixed duration
- Event-Based Wait: pause until customer performs specific event (or window expires)
- Wait Since Event: wait a defined duration since a specific event
- Condition Split: branch based on customer attributes/event conditions
- Audience Split: divide audience into groups for different flows
- Join Block: merge multiple paths back to single flow

**Journey editing rules:**
- Editing a live journey creates a new version (v1)
- Options for existing customers in v0: Move to new version, Sunset (v0 continues for existing), or Stop v0

**Incentive types supported in Engage+:**
- Coupons/Offers: percentage discount, fixed-value discount, free item, BOGO
- Points: bonus points issued in bulk via campaign to a defined audience
- Points Strategy: earn rate logic for points issuance tied to campaigns
- Cart Promotions: auto-apply discounts at POS/checkout based on cart conditions
- Gift Vouchers: issued via campaign message or journey engagement block
- Badges: gamification badges issued via campaigns or journeys
- DVS (Dynamic Voucher System): activity-based — customer must perform an action to receive the voucher

**Campaign types:**
- Broadcast: one-time send to defined bulk audience
- Recurring: automated repeat sends; audience refreshed via FTP Connector + Connect+; dataflow must run ≥4h before send; campaign must be approved ≥2h before first trigger
- Journey Campaign: multi-step, event-triggered
- Referral: referral codes to existing customers; set up in Old UI first, then link to Broadcast in New UI
- Survey: collect NPS and feedback
- Bounceback/DVS: customer transacts first, then receives voucher
- Ads Audience (Facebook): push segment to Facebook Ad Manager for paid media

**Campaign approval rule:** All campaign messages must be sent for Approval before execution. Approvals must be completed at least 2 hours before the first scheduled trigger.

**Key Engage+ metrics:**
- Contacted Customers, Delivery Rate, Hit Rate, Responder Sales, Incremental Sales
- Incremental Sales formula: (Test Hit Rate − Control Hit Rate) × Test Contacted × (Total Responder Sales ÷ Test Responders)

---

### Loyalty+ (Loyalty Engine)

**What it is:** Points accrual, tier management, earning rules, rewards redemption logic.

**Key configuration areas for BRD FRs:**
- Earning rule definition (transaction type, category, brand filters, multipliers)
- Tier upgrade/downgrade thresholds and cooldown periods
- Points ledger and balance visibility
- Points burn rules (redemption rate, minimum redemption, partial redemption)
- Points expiry (fixed-date or rolling based on last activity)
- Workflow simulation for validating rule logic before go-live
- Advanced Capping: daily/weekly/monthly caps per customer or per promotion

**Loyalty Promotions:**
- Types: points multiplier, bonus points, tier accelerator, product-specific earn
- Qualifying conditions: customer segments, stores, products, transaction values, timeframes
- Brand Actions: what the promotion rewards and promotion-level capping
- Configure approval workflows for promotions if internal sign-off is required

**Programme types to identify in BRD:**
- Transactional Loyalty: points on spend
- Behavioural Loyalty: points for non-purchase actions
- Subscription Programme: fee-based membership tiers
- Coalition Programme: shared points across partner brands
- Multi-Loyalty: separate programmes for different segments or brands

---

### Rewards+ / Catalog Promotions (Marvel Implementation Reference)

**What it is:** Points redemption marketplace where members redeem for rewards. Catalog Promotions enable time-limited, item-level discounts and combo offers within the rewards catalog.

**Rewards Catalog setup:**
- Reward Types: vouchers, physical merchandise, experiences, partner rewards, charity donations
- Configure redemption controls: min/max points per transaction
- Reward Ownership: which org or brand owns each reward
- Grouping and Ranking: control how rewards are displayed
- Discounts and promotional pricing on catalog items for time-limited offers
- Alternative payment modes: points+cash redemption
- Rewards+ Agent Support Tool for customer service team

**Catalog Promotions (from Marvel implementation):**
- Define promotion type: percentage discount, fixed-value discount, BOGO, bundle offer
- Qualifying conditions: minimum basket value, specific SKUs, product categories, combo purchases
- Discounts auto-applied at POS or e-commerce checkout — no coupon code required
- Fraud prevention: Cart Locking to prevent duplicate or fraudulent redemptions
- Grouping and Ranking controls how promotions are surfaced in the catalog

**Partner Rewards:**
- Hotel vouchers, airline miles transfer, dining credits, SPA entry
- Minimum 5 partner categories recommended at launch
- Partner-specific fulfilment flows via APIs

**Coupons & Offers:**
- Create Offer series: percentage, fixed value, free item, BOGO
- Issuance rules: auto-issue via loyalty workflows, via campaigns, or manual via Member Care
- Redemption rules: single-use, multi-use, channel restrictions, expiry
- Offer Event Notifications for when a coupon is issued or redeemed

**Badges & Gamification:**
- Badge types: milestone, loyalty tier, behavioural achievement
- Badge earn criteria via loyalty workflows, promotions, or campaigns
- Games integration: CataBoom, CustomerGlu, or client-native games; link game events to Capillary behavioral events
- Streaks: reward sustained engagement patterns

---

### CDP (Customer Data Platform)

**What it is:** Member segmentation, audience building, behavioral analytics.

**Key configuration areas:**
- Segment creation based on RFM (Recency, Frequency, Monetary)
- Behavioural segments (bought X brand, visited Y store, browsed Z category)
- Demographic segments (age, location, gender, tier)
- Lookalike audiences for campaign targeting
- Churn prediction segments
- Tourist member identification (device locale, nationality, transaction currency patterns)
- Behavioural Events: available once SDK/API integration is live

**Customer Segmentation in Insights+:**
- Advanced SQL-based or file-upload segments
- Segment export to Campaign Manager
- Customer Segmentation SQL Traits for advanced segment creation from raw data

---

### Marvel Implementation — Key Technical Patterns

**Organisation Setup:**
- Set up Org name, timezone, currency from day one
- Configure Organisation Units (OUs) for sub-brands or regional divisions
- Connected Organisations for entities sharing customer data across org boundaries
- RBAC: Role-Based Access Control for all team members

**API Integration patterns:**
- REST APIs: Add Customer, Add Transaction, Get Customer, Redeem Points, Issue Coupon
- Authentication: OAuth2 client credentials or Basic Auth (Till ID + password)
- Till credentials must have correct access group permissions per operation
- Test all API calls end-to-end in staging using Postman or Capillary 'Try it' feature
- Build error-handling and retry logic in client systems

**Connect+ (Batch Data Ingestion):**
- Templates: Add Customer, Add Transaction, Goodwill Points, or custom dataflow
- Source connectors: SFTP, S3, Kafka, API
- Add transformation, validation, and encryption/decryption blocks
- Test in UAT before scheduling in production
- Use Analyse Dataflow Performance tool to monitor

**Mobile SDK:**
- Platforms: Android, iOS, React Native, Flutter
- Configure Firebase for push notification delivery
- Set up Source Account and Gateway in Capillary
- Initialise SDK and implement event tracking calls for key user actions
- Configure Push Notifications, In-App Messaging, and Notification Centre

**Neo (Custom Logic Extension):**
- Use when: custom data validation/enrichment, third-party integrations, async high-volume processing, event notification enrichment, custom reward/points calculation
- Workflow: Design → Submit for Review → Approve → Activate in production
- Monitor via Dev Console; use API Logs and Platform Metrics for debugging
- Aira Coder (AI-Assisted Dataflow Creation) available to accelerate development

**Vulcan (Custom UI):**
- Build custom Member Care views (loyalty wallet display, customer 360 panel)
- Build custom Microsites for branded loyalty portals
- Vulcan DEV access: upload builds, enable UAT mode, manage deployments
- Promote builds from UAT to Production only after client sign-off

**Event Notifications & Webhooks:**
- Configure for: transaction add, points award, tier change, coupon issue/redemption, badge award
- Webhooks: push real-time event data to client systems (app, CRM, data warehouse)
- Define Event Schema (payload structure) per notification type
- Monitor Event Feed; configure delivery retry logic for reliability

**UAT & Go-Live protocol:**
- Test all API integrations end-to-end: registration, transaction add, points earn, tier upgrade, coupon issue and redemption
- Test all Connect+ dataflows with sample data files
- Validate Loyalty Workflow rules via Workflow Simulation tool
- Test all campaign message templates across every channel
- Validate Journeys using Journey Test feature
- Test Rewards Catalog: redemption flows, point deduction, reward fulfillment
- Validate Reports and Data Exports
- Test Event Notifications: verify webhook payloads arrive correctly
- Sign off UAT checklist with client stakeholders before production migration
- Monitor first 24–72 hours post go-live: API error rates, live transaction data, points award validation

**Monthly Optimisation Cadence (include in BRD KPIs section):**
- Review Delivery Rate by channel — investigate if below threshold
- Review Hit Rate and Responder Sales for all active campaigns
- Analyse Journey block-level drop-offs — adjust wait times or content
- Review A/B test results and update journey versions accordingly
- Audit active audience groups
- Review coupon and offer redemption rates
- Check Incremental Sales (Test vs. Control) for major campaigns
- Review Capillary Release Notes quarterly for new features

---

## Flow Diagram

The file `PM_Pipeline_Flow.jsx` contains the interactive React flow diagram
showing all 3 phases, gate rules, Confluence folder structure, and connector gates.

**3 tabs:**
1. **⚡ Delivery Flow** — expandable phase cards with inputs/outputs
2. **📁 Confluence Structure** — interactive folder tree with file lists
3. **🔒 Gate Rules** — explicit checklist per gate before advancing

---

## Reference Files

| File | Purpose |
|------|---------|
| `JiraBRD_Skill_Dynamic.md` | BRD creation + Jira ticket generation |
| `SKILL.md` (pre-brd-discovery) | Discovery dashboard build |
| `brd_template.md` | BRD base template (13 sections) |
| `discovery-sections.md` | Full question bank per section |
| `brd-section-map.md` | 19 BRD sections → discovery tab mapping |
| `discovery-dashboard-template.md` | HTML/CSS/JS dashboard build pattern |
| `PM_Pipeline_Flow.jsx` | Interactive flow diagram (Confluence embed) |
| `EngagePlus_StepByStep_Approach.docx` | Engage+ module implementation reference |
| `Marvel_Capillary_Implementation_Approach.docx` | Marvel full-stack implementation reference |
| `capillary-modules.md` | Module catalogue (Loyalty+, Engage+, Rewards+, CDP, etc.) |
| `capillary-fr-examples.md` | Example FRs per Capillary module |

---

## Quick Reference — Gate Checklist

| Gate | From | To | Must Pass |
|------|------|----|-----------|
| Gate 1 | Phase 01 | Phase 02 | BRD signed off by client BPO; all 19 sections populated; all 🔴 Critical Guardrail Gaps resolved |
| Gate 2 | Phase 02 | Phase 03 | Discovery 100% · Yes/No section 100% confirmed · All Guardrail 🔴 Critical + 🟡 Risk items resolved or waived · Guardrail Scorecard exported |

## Benefits of Guardrails in This Pipeline

- **Faster Decision-Making:** Pre-defined limits allow teams to make independent decisions without constant upper-management approval loops
- **Risk Mitigation:** Proactively surfaces risks and gaps in the planning phase — before Jira tickets are created
- **Stakeholder Alignment:** Ensures all parties (developers, PM, client executives) share a unified understanding of scope, compliance obligations, and success criteria
- **Audit Trail:** Every gap, owner, and resolution is logged in the BRD Clarification Register and Discovery export — fully traceable
