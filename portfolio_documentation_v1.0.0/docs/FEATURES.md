# Feature Specification


## Master feature inventory

| Feature | Route / section | Current implementation | Primary data/source | Maintenance sensitivity |
|---|---|---|---|---|
| Console header/navigation | Global | Sticky/consistent console-themed header, active states, Credentials grouping, Resume and Terminal actions | `Layout.tsx` | High — route/hash/mobile state |
| System Profile / Hero | `/#home` | Operator identity, availability, summary metrics and CTAs | `profile.json`, computed stats | Medium |
| Platform Delivery Lifecycle | `/#home` | Five-stage Plan→Build→Infra→Deploy→Monitor model | Component + current technology content | Medium |
| About Operator | Overview flow | Professional story, specialization, industry, community, languages | profile/future/education content | Low/medium |
| Professional Experience | `/#experience` | Seven-entry expandable timeline at this revision | `experience.json` | High — dates/current state/resume |
| Projects search/filter | `/#projects` | Search + work/domain filters + inventory count | published `projects.json` | High — categories/counts |
| Project details | `/projects/[slug]` | Narrative + Mermaid topology + outcomes/responsibilities/stack | `projects.json` | High — slug/diagram/confidentiality |
| Skills inventory | `/#skills` | 25 skills across six categories at this revision | `skills.json` | Medium/high — proficiency/cert links |
| Certifications | `/#certifications` | Five verified credential cards at this revision | `certifications.json` | Medium — links/assets |
| Education & award | `/#education` | Degree, graduation project and honor | `education.json` | Low/medium |
| Course preview | `/#education` | Selected course preview + full-inventory CTA | `courses.json` | Medium |
| Professional Courses | `/courses` | 23 records at this revision; search + 3 filters + certificate actions | `courses.json` | High — count/filter/cert assets |
| Dynamic web resume | `/resume` | Content-driven multi-view resume + print/download controls | resume selectors from central content | High — sync with PDF |
| Static resume PDF | `/resume/Osama_Farouk_DevOps_Resume.pdf` | Downloadable two-page PDF | `public/resume/...pdf` | **High — currently stale** |
| Interactive terminal | `/#terminal` | Contextual portfolio command engine with help, search/show/open, history, autocomplete and confirmations | `terminalEngine.ts` + content selectors | High |
| Contact endpoints | `/#contact` | Email, LinkedIn, GitHub, phone, region | profile/social content | Medium |
| Contact form | `/#contact` | Client validation, inquiry types, honeypot, duplicate guard, Formspree HTTPS POST | `Contact.tsx` | High — external provider/privacy |
| Footer/status | Global | Version + health indicator | `APP_VERSION` / layout | Low unless version model changes |
| Back-to-top | Long pages | Fixed action after scroll threshold | `Layout.tsx` | Low |
| Security headers | Global HTTP | CSP, frame/nosniff/referrer/HSTS/permissions controls | `next.config.ts` | High — security/build compatibility |
| CI pipeline | Repository | Validate, typecheck, lint, test, build on main/develop push/PR | `.github/workflows/ci.yml` | High |
| Content CLI | Repository | Guided add-project/experience/skill/certification + validators | `scripts/`, `package.json` | Medium/high |
| Controlled release scripts | Local operator workflow | Five-stage develop→main/tag workflow | `portfolio-scripts/` | High — production safety |

## 1. Design concept

The production experience uses an operations/control-plane visual system: dark background, cyan primary accents, green health/status states, orange warning/intermediate states, monospace-oriented technical labels, inventory/node terminology and bordered console cards. The design is intentionally aligned with DevOps/SRE subject matter rather than generic personal-site aesthetics.

Exact CSS tokens should be read from the current stylesheet/theme when changing visuals; this document intentionally avoids freezing pixel/color values that may change.

## 2. Hero / System Profile

### Purpose
Present identity, role, availability, top-level credibility metrics and immediate actions.

### Reviewed content

- Osama Farouk
- `DevOps Engineer`
- open to selected roles
- freelance consulting available
- Cairo, Egypt
- UTC context
- 5+ years experience
- professional summary
- current counts for certifications, projects and organizations
- CTAs: Contact, View Projects, Download Resume

### Maintenance
Edit profile data in `content/profile.json`; do not duplicate the same text in multiple components unless the design intentionally needs a separate label.

## 3. Platform Delivery Lifecycle

### Purpose
Translate the technology inventory into an end-to-end operating model.

### Phases
Plan & Collaborate → Build & Validate → Provision & Configure → Package & Deploy → Operate & Observe.

### Maintenance
When adding/removing a lifecycle technology, verify both the skills inventory and this presentation remain truthful. A tool appearing here should represent a meaningful part of the operating workflow, not merely a course exposure.

## 4. Professional Story and specialization

The About Operator area provides narrative context and four specialization nodes. It should change less frequently than project/skill datasets. Keep it outcome-focused and avoid turning it into another long tool list.

## 5. Experience system

### Interaction
Timeline cards expand/collapse to reveal structured details. Current experience receives a stronger state treatment.

### Data
`content/experience.json` through typed loaders.

### Safe maintenance
Use a stable unique `id`; provide accurate dates/current flag; keep company/client separation consistent; update professional story/resume visibility if the role materially changes positioning; add technologies only when actually used.

## 6. Projects system

### Search and filtering
Projects can be queried by title/technology/category and filtered by work type or technical domain. Filters operate on the current published inventory.

### Card contract
A project card includes stable slug/node ID, title, type/status/year, concise description, outcome metrics, tags, role and detail action.

### Detail contract
A detail route may include:

- title/tagline/type/date;
- role and organization/employer;
- architecture topology;
- problem statement/context;
- solution and delivery approach;
- engineering challenges/resolution;
- key outcomes;
- responsibilities;
- technology stack;
- sanitized/confidential-source state.

See `PROJECTS.md` for the six reviewed records.

## 7. Skills system

### Categories at revision 1.0.0

1. Cloud & Virtualization
2. Containers & Orchestration
3. Infrastructure as Code & Scripting
4. CI/CD, Version Control & Code Quality
5. Monitoring & Observability
6. Systems, Networking & Operations

### Proficiency contract
Only `Intermediate` and `Advanced` are exposed in the current UI. Years are displayed independently. Certification associations are optional and can render as badges inside skill rows.

### Maintenance rule
Do not add a new proficiency vocabulary without updating data validation, legend UI, terminal output if applicable, tests and this documentation.

## 8. Certifications

Credential cards are backed by `content/certifications.json` and support issuer, code, issue metadata, verification URL and badge/image presentation fields. The reviewed production page displays five cards:

- AWS Certified Cloud Practitioner
- AWS Certified Solutions Architect – Associate
- CKA: Certified Kubernetes Administrator
- Red Hat Certified System Administrator (RHCSA)
- HCIA – Datacom, Huawei Certified (Routing & Switching)

Verification is an outbound action and should use the issuer/Credly verification record where available.

## 9. Professional Courses

`/courses` is a dedicated searchable/filterable inventory rather than a long static section embedded in the homepage. The home Education section previews selected courses and links to the full route.

Course data supports:

- ID
- title
- provider
- year
- certificate image
- certificate URL
- verification URL

A missing certificate image is an explicit presentation state, not a broken-image fallback.

## 10. Education, awards and community

The reviewed Education section contains the Communication Engineering bachelor's degree, graduation-project details and the 2019 JAC-ECC first-place award. Community involvement is exposed in the About area through GDG Delta. These values originate from structured content rather than the old PDF resume.

## 11. Dynamic resume

### Web resume

**Verified:** `/resume` is an interactive, content-driven resume view with controls for:

- Full Resume
- Experience
- Technical Stack
- Education & Certs
- Courses & Awards
- Print Record
- Download PDF

The web resume consumes central content selectors and includes the current ZainTech role.

### Downloadable PDF

**Verified current debt:** the PDF at `/resume/Osama_Farouk_DevOps_Resume.pdf` is a separate static file and is older than the current web resume: it still presents ProgressSoft as current and omits ZainTech.

### Maintenance requirement
Any career/certification change that should appear in both formats requires:

1. central content update for the web resume;
2. regenerate/replace the static PDF;
3. run the automated PDF availability test;
4. manually compare PDF and web resume for synchronization.

## 12. Contact system

### Fields

- Name — required, max 100
- Return Email — required, email validation, max 254
- Inquiry Type — selectable
- Subject — optional
- Message Body — required, max 3000

### Inquiry types
General Inquiry; Job Opportunity; DevOps / Cloud Consulting; Project Collaboration; Professional Networking; Other.

### Submission behavior
**Verified:** The component sends JSON via HTTPS directly to Formspree. It uses a hidden honeypot field and tracks the exact signature of the last successful message in component state to block an immediate duplicate during the same page/component lifetime. It interprets 429 as a rate-limit state and provides success/error UI feedback.

This duplicate prevention is **not** a persistent/server-global deduplication system.

### Privacy/security
The form does not need to open a local mail client. Do not add secrets to client-side code. Treat the Formspree endpoint as public configuration rather than a secret API credential.

## 13. Footer

The footer displays copyright, secure-console version and portal health. Version is derived from the authoritative application version rather than manually copied.

## 14. UI/UX behavior

### Verified interaction patterns

- active nav underline/highlight;
- expandable timeline records;
- search and filter surfaces;
- external verification links;
- project detail navigation;
- persistent back-to-top affordance on long content;
- terminal command interaction;
- status chips and inventory counters;
- desktop card grids responsive to viewport breakpoints.

### Recommended UI regression focus
The most layout-sensitive areas are project architecture diagrams, course/certification grids, skills density, long experience text, terminal prompt/output and header navigation at tablet/mobile widths.
