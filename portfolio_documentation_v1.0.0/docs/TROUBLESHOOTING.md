# Troubleshooting, Known Issues and Technical Debt

## 1. Current known issues / content debt

### 1.1 Static downloadable resume is stale — High content priority

**Observed:** The dynamic `/resume` view includes ZainTech as the current role, while the downloadable PDF still starts its experience section with ProgressSoft as current (`May 2025 – Present`) and omits ZainTech.

**Impact:** A recruiter can receive information inconsistent with the live portfolio.

**Resolution:** Regenerate/replace `public/resume/Osama_Farouk_DevOps_Resume.pdf`, then manually compare it with dynamic resume/current content. The current automated test only checks PDF existence/size.

### 1.2 Kubernetes Observability copy contains authoring placeholders — Medium content priority

**Observed:** Alert-related project-detail wording contains conditional language such as “if tested” / “if actually implemented.”

**Impact:** Reduces credibility because it reads as an internal editing note rather than a finished engineering result.

**Resolution:** Verify what was actually tested, then replace with a precise factual claim or remove the claim.

### 1.3 README project tree is stale — Low/medium developer-documentation priority

**Observed:** README material references the older `src/pages` structure while the production source uses `src/app` App Router.

**Impact:** A maintainer can edit/look in the wrong location.

**Resolution:** Update repository README structure and reference this documentation set.

### 1.4 Terminal course-count drift risk — Medium maintainability priority

**Observed:** Some terminal engine copy embeds the current `23` course total even though the course page is data-driven.

**Impact:** Adding a course can produce inconsistent totals/help text.

**Resolution:** derive all terminal counts from the central data/stat selectors.

### 1.5 Legacy terminal implementation file — Review required

**Observed:** `Terminal.tsx` imports `terminalEngine.ts`; the source tree also contains the simpler `terminalCommands.ts` implementation.

**Impact:** Potential maintainer confusion or dead-code burden.

**Resolution:** Search all imports. If unused and intentionally superseded, remove it in a tested refactor; otherwise document its remaining caller.

## 2. Resolved historical issues

### Terminal navigation/state confusion
Earlier development iterations encountered command-context confusion when repeated selections were made. The current architecture uses explicit terminal context, record-specific list/show/open operations and pending Y/N navigation confirmation. Treat the current engine as the authoritative behavior.

### Terminal placement/navigation iterations
Earlier concepts experimented with different terminal placement/navigation patterns. Production now exposes a dedicated home terminal section with a top-navigation action; do not revive old dock behavior without a new design decision.

### Release workflow conflict handling
The final scripts explicitly block unsafe Git states and avoid broad automatic resolution/force pushes. This replaced riskier manual/ad-hoc release handling.

## 3. Troubleshooting matrix

| Problem | Diagnosis | Corrective path |
|---|---|---|
| `npm ci` fails | Lockfile/dependency/runtime mismatch | Confirm Node 20, clean working tree, valid `package-lock.json`; avoid deleting lockfile casually. |
| `validate:content` fails | Malformed/missing content field | Fix canonical JSON; do not patch UI to hide bad data. |
| Typecheck fails after data model change | Interface/content mismatch | Update interface + all consumers; validate selectors/resume/terminal. |
| Project missing from list | `draft: true`, schema issue or filter | Inspect project record and publication filter. |
| Project detail 404 | Slug mismatch | Compare card slug, route parameter, terminal link and content record. |
| Mermaid diagram fails | Syntax or unsupported diagram content | Validate Mermaid text and reduce problematic labels/characters. |
| Course count inconsistent | hard-coded terminal text | Replace with data-derived count and retest terminal. |
| Certification badge missing | bad asset path / presentation class | Verify public file path/casing and content record. |
| Credential link wrong | stale verification URL | Replace with authoritative issuer/Credly link and manual test. |
| Contact form rejects valid input | validation or provider response | Inspect field limits/network response; confirm Formspree state. |
| 429 contact error | provider rate limit | Preserve user feedback; retry later rather than bypassing provider protection. |
| Terminal Y/N seems stuck | pending confirmation active | Answer Y/N/cancel or Escape; unrelated commands are intentionally blocked. |
| Terminal wrong numeric record | context bug | Verify `nextContext`, displayed collection, record resolver and command history. |
| PDF downloads but content old | static asset not regenerated | Replace PDF; automated availability test cannot detect semantic staleness. |
| Footer version mismatches tag | release/version flow bypassed | Reconcile `package.json`, tag, `version.ts`; publish corrected release. |
| Vercel live version old | production deployment not triggered/failed | Inspect Vercel production branch/deployment and main commit status. |

## 4. Potential improvement backlog

These are recommendations, not current features:

- add browser E2E tests (Playwright) for nav, filters, terminal and contact validation;
- add a semantic resume freshness check or generation pipeline so static PDF cannot silently drift;
- derive every inventory count from shared selectors;
- remove verified-unused legacy terminal code;
- update public README to App Router and link this documentation;
- formalize CSP hardening review;
- add automated accessibility/Lighthouse checks for major routes;
- add a documentation freshness script that compares package version/content counts with a machine-readable manifest.
