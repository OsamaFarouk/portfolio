# How to Update the Portfolio

## 1. General change protocol

For every change:

1. Start from a clean, synchronized `develop` branch.
2. Identify the canonical content/source file.
3. Make the smallest coherent change.
4. Validate locally and inspect affected interactions.
5. Save/push through the controlled workflow.
6. Prepare a release only when ready.
7. Run final testing against the exact release candidate.
8. Publish through the controlled `main` merge/tag workflow.
9. Validate production.
10. Update only the documentation modules affected by the change.

## 2. Add a new job

**Change:** `content/experience.json`.

Also review `profile.json` summary/title if positioning changed, terminal experience output, dynamic resume visibility, project relationships and static PDF resume.

**Could break:** date ordering, current-role state, organization count, logo path, resume consistency.

**Test:** experience timeline expand/collapse; current badge; mobile widths; terminal `experience list/show/open`; `/resume`; footer/summary metrics if affected.

**Docs:** `FEATURES.md`, `CONTENT_MODEL.md` only if structure changes, `README.md` snapshot if count matters, `CHANGELOG.md`; update project docs if new role adds a published project.

## 3. Add a new project

**Change:** `content/projects.json` or `npm run add:project`.

**Required:** unique slug, accurate type/date/role, `draft` state, sanitized narrative, tags, results, optional architecture.

**Could break:** route collision, search/filter category, Mermaid syntax, inventory count, terminal numeric/slug addressing.

**Test:** project list/search/filter, detail route, diagram, terminal projects list/show/open, mobile overflow, build.

**Docs:** `PROJECTS.md`, `SITE_STRUCTURE.md`, `README.md` snapshot, `MAINTENANCE.md` only if process changes, `CHANGELOG.md`.

## 4. Add a new skill

**Change:** `content/skills.json` or `npm run add:skill`.

**Could break:** category density/overflow, total skill count, proficiency vocabulary, certification association.

**Test:** skills layout, terminal skills search/list, resume technical-stack view, mobile widths.

**Docs:** `FEATURES.md` if category/proficiency model changes; `CHANGELOG.md` for meaningful inventory updates.

## 5. Update skill proficiency or years

Edit the existing skill record; do not create a duplicate. Keep evidence-based `Intermediate`/`Advanced` labels.

Test skill display, linked badge and resume. No architecture documentation update is needed unless the proficiency model itself changes.

## 6. Connect a certification to a skill

Update the skill's certification association using the existing ID/code conventions and ensure the certification record has a working verification target. Test badge click and credential route/link.

## 7. Remove a skill

Search the repository for the skill label before deletion. Projects can legitimately keep a technology tag even when it is removed from the current skills inventory; decide intentionally rather than bulk deleting references.

## 8. Add a certification

**Change:** `content/certifications.json` or `npm run add:certification`; add badge asset if needed.

Then link it from `skills.json` where appropriate.

**Test:** certification card, image, verification action, skills badge, dynamic resume, terminal certifications list/show/open.

**Docs:** `FEATURES.md` inventory if explicitly listed, `README.md` snapshot, `CHANGELOG.md`.

**Also:** regenerate static PDF resume if the credential should appear there.

## 9. Add a course

**Change:** `content/courses.json`; add certificate asset/verification URL where applicable.

**Test:** `/courses` total, search, provider/year/topic filters, certificate image modal/link, home preview behavior, terminal `courses` command.

**Known risk:** terminal copy currently contains a hard-coded `23` in some output. Update/derive this value when course count changes.

## 10. Update professional summary

Change `content/profile.json`. Check Hero, About narrative, dynamic resume and terminal profile output for semantic consistency.

If the static PDF should use the same summary, regenerate it separately.

## 11. Change project architecture

Edit the project architecture data/Mermaid plus corresponding solution/responsibilities/outcomes. Test Mermaid syntax, desktop/mobile overflow and confidentiality.

Update the matching section of `PROJECTS.md`.

## 12. Update a company logo

Replace/add the public asset and update the experience record path. Preserve reasonable aspect ratio and alt/semantic presentation. Test white-background logos on dark cards and narrow-screen layout.

## 13. Change external links

Edit canonical social/certification/course/project link data. Test the destination and ensure `_blank` links retain `rel="noopener noreferrer"`; the automated suite enforces this pattern in TS/TSX.

## 14. Update the terminal

Behavior changes belong in `terminalEngine.ts` and/or `Terminal.tsx`. Do not reintroduce a second competing command implementation.

Test help, aliases, invalid input, context, numeric/text selection, history, autocomplete, clear, Escape, Y/N and all changed routes.

Update `TERMINAL.md` and tests.

## 15. Add a terminal command

Follow the eight-step procedure in `TERMINAL.md`. If the command exposes a new dataset, add a stable context/data selector rather than directly embedding raw content in UI code.

## 16. Update contact form

Update `Contact.tsx` and any related copy. Reassess validation limits, inquiry options, Formspree payload, honeypot, duplicate behavior and states.

Do not add privileged Formspree/API credentials to client code.

Test empty/invalid inputs, valid submission, duplicate attempt, simulated/non-destructive error path, mobile form layout.

## 17. Modify navigation

Change centralized `Layout.tsx` behavior and ensure ScrollSpy/path state stays aligned. Update mobile navigation, active states, hash handling and dedicated-route return behavior.

Docs: `SITE_STRUCTURE.md`, `FEATURES.md`, `TESTING.md` if regression coverage changes.

## 18. Update resume

### Dynamic web resume
Change central content and selectors only when necessary. Test every resume tab plus print view.

### Static PDF
Regenerate/replace `public/resume/Osama_Farouk_DevOps_Resume.pdf`; compare it manually with current career/certification content. The automated test checks file existence/size but not freshness.

## 19. Update dependencies

Use a dedicated `chore`/security change. Review changelogs for Next.js/React/Tailwind/Mermaid behavior; run full `npm ci`, typecheck, lint, tests, build and production smoke checks. Avoid mixing major dependency upgrades with unrelated content edits.

## 20. Publish a production version

Use scripts 03 → 04 → 05 after normal changes are committed/pushed on `develop`. Do not manually tag before the controlled publish stage.

---

# Documentation Update Matrix

| Portfolio change | Documentation sections/files to update |
|---|---|
| New job | `FEATURES`, `README` inventory if tracked, `CHANGELOG`; static PDF note; `PROJECTS` if related project added |
| Job responsibilities/stack change | `FEATURES` only if behavior/model changed; `CHANGELOG` for significant content change |
| New project | `PROJECTS`, `SITE_STRUCTURE`, `README` snapshot, `CHANGELOG` |
| Project slug change | `PROJECTS`, `SITE_STRUCTURE`, inbound links, terminal docs, `CHANGELOG` |
| Project architecture change | `PROJECTS`, possibly `ARCHITECTURE`, `CHANGELOG` |
| New skill | `README` snapshot if tracked, `FEATURES` if category model changes, `CHANGELOG` |
| New skill category/proficiency level | `FEATURES`, `CONTENT_MODEL`, `TERMINAL` if exposed, `TESTING`, `CHANGELOG` |
| New certification | `FEATURES`, `README` snapshot, skill relationships, `CHANGELOG` |
| Credential verification URL change | `INTEGRATIONS` only if integration pattern changes; `CHANGELOG` if notable |
| New course | `README` snapshot, `FEATURES` if behavior/count wording changes, `TERMINAL` hard-coded count check, `CHANGELOG` |
| Education/award change | `FEATURES`, dynamic/static resume, `CHANGELOG` |
| Professional summary change | `FEATURES` only if feature behavior changes; static resume sync; `CHANGELOG` |
| New terminal command | `TERMINAL`, `TESTING`, `CHANGELOG` |
| Terminal parser/context change | `TERMINAL`, `ARCHITECTURE` if design changes, `TESTING`, `DECISIONS` if major |
| Navigation change | `SITE_STRUCTURE`, `FEATURES`, `TESTING`, `CHANGELOG` |
| New route | `SITE_STRUCTURE`, `ARCHITECTURE`, `FEATURES`, `TESTING`, `CHANGELOG` |
| Contact provider/behavior change | `FEATURES`, `INTEGRATIONS`, `SECURITY_ACCESSIBILITY_PERFORMANCE`, `TESTING`, `CHANGELOG` |
| Security-header change | `ARCHITECTURE`, `SECURITY_ACCESSIBILITY_PERFORMANCE`, `TESTING`, `CHANGELOG` |
| Dependency/framework major update | `ARCHITECTURE`, `DEVELOPMENT`, `DEPLOYMENT`, `TESTING`, `CHANGELOG` |
| Git/release workflow change | `GIT_WORKFLOW`, `DEVELOPMENT`, `DEPLOYMENT`, `TESTING`, `DECISIONS`, `CHANGELOG` |
| Vercel deployment change | `INTEGRATIONS`, `DEPLOYMENT`, `GIT_WORKFLOW` if branch model changes, `CHANGELOG` |
| Resume layout/data selector change | `FEATURES`, `CONTENT_MODEL`, `TESTING`, `CHANGELOG` |
| Static PDF update only | `CHANGELOG`; update known-issues section when synchronization debt is resolved |
| UI design-system change | `FEATURES`, `SECURITY_ACCESSIBILITY_PERFORMANCE`, `TESTING`, `CHANGELOG` |

---

# Documentation versioning

Use `MAJOR.MINOR.PATCH`:

- **MAJOR** — major documentation architecture restructuring or portfolio architecture change requiring broad rewrite.
- **MINOR** — new feature/route/project category or substantial new documented capability.
- **PATCH** — corrections, content synchronization and localized documentation updates.

A new portfolio project does not automatically require a documentation MAJOR bump. Usually it is a documentation MINOR if the docs gain a substantial new project section, otherwise a PATCH for small factual synchronization.

# Drift detection procedure

When asked to verify freshness:

1. Read the metadata/version in this documentation.
2. Read production footer/terminal application version.
3. Compare current `main` package version/tag.
4. Diff current content counts and stable IDs against documented snapshots.
5. Review recently changed routes/components.
6. Compare dynamic resume with static PDF.
7. Return each item as one of:
   - **In Sync**
   - **Documentation Outdated**
   - **Website Changed**
   - **Documentation Missing**
   - **Requires Manual Verification**
8. Update only affected modules, metadata and changelog.
