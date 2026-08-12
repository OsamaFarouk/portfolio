# Testing and Regression Checklist

## 1. Automated quality gates

### Local final-test sequence

```text
validate:content
→ lint
→ typecheck
→ test
→ build
```

### GitHub Actions
Runs on pushes and PRs targeting `main` and `develop`, using Node 20. It performs deterministic dependency install, content/tag validation, typecheck, lint, tests and build.

## 2. Automated test coverage reviewed

The current Node test suite validates:

- static resume PDF availability/size;
- safe `target="_blank"` link rel attributes;
- security-header presence;
- project slug/title integrity and minimum inventory threshold;
- obvious committed AWS/private-key patterns in content;
- authoritative package-based version display;
- release-tag validation behavior.

These are repository integrity tests, not browser end-to-end tests. Search/filter/terminal/form/responsive behavior still requires manual regression testing.

# Production Release Checklist

## Git and release state

- [ ] `01-start-working.ps1` completed without unfinished Git operation.
- [ ] Current work is on `develop`.
- [ ] Working tree changes were reviewed before commit.
- [ ] `develop` is synchronized with `origin/develop`.
- [ ] All intended changes are committed and pushed.
- [ ] Release version is the intended semantic version.
- [ ] Final-test record corresponds to the exact release-candidate commit.
- [ ] No force push or manual tag overwrite is required.

## Automated validation

- [ ] `npm run validate:content` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] GitHub Actions pipeline passes on the relevant branch/PR.

## Overview and navigation

- [ ] Root page loads without console/runtime errors.
- [ ] Header identity/home action works.
- [ ] Overview navigation and active state work.
- [ ] Experience navigation and active state work.
- [ ] Projects navigation and active state work.
- [ ] Skills navigation and active state work.
- [ ] Credentials dropdown opens/closes correctly.
- [ ] Certifications destination works.
- [ ] Professional Courses destination works.
- [ ] Education/Award destination works.
- [ ] Contact navigation works.
- [ ] Resume route works.
- [ ] Terminal navigation works.
- [ ] Dedicated routes can return to home hash sections correctly.
- [ ] Back-to-top control appears/works after scrolling.

## Hero / About

- [ ] Profile image and status indicators render.
- [ ] Current role/summary/availability text is correct.
- [ ] Snapshot counts reflect current datasets.
- [ ] Contact/View Projects/Download Resume CTAs work.
- [ ] Platform Delivery Lifecycle labels/tools remain accurate.
- [ ] Professional Story, specializations, industries, community and languages render correctly.

## Experience

- [ ] Timeline entry count matches current data.
- [ ] Current role is correct and visually indicated.
- [ ] Each card expands/collapses.
- [ ] Dates, locations and client/project labels are accurate.
- [ ] Company logos render without distortion.
- [ ] Responsibilities/achievements/technology tags are readable.
- [ ] No confidential client data is exposed.

## Projects

- [ ] Project inventory count matches published records.
- [ ] Search returns expected title/technology/category matches.
- [ ] Every project filter works.
- [ ] Each card shows correct type/year/role/tags.
- [ ] Every `INSPECT_CASE` route resolves.
- [ ] Every architecture diagram renders without syntax error.
- [ ] Diagrams remain usable at narrow widths.
- [ ] Problem/solution/challenges/results are synchronized with topology.
- [ ] Sanitized professional projects expose no restricted data.

## Skills

- [ ] Total skill count matches data.
- [ ] Every category renders.
- [ ] Intermediate/Advanced legend matches row styles.
- [ ] Years/proficiency values are correct.
- [ ] Certification badges link to correct credentials.
- [ ] Dense category cards do not overflow.

## Certifications

- [ ] Credential count matches current records.
- [ ] Badge images render.
- [ ] Issuer/name/code are correct.
- [ ] Every verification link reaches the intended authoritative record.
- [ ] External links open with safe rel behavior.

## Education and Courses

- [ ] Degree and award content is correct.
- [ ] Home course preview is correct.
- [ ] `VIEW ALL` opens `/courses`.
- [ ] Course total matches data.
- [ ] Course title/provider/topic search works.
- [ ] Provider filter works.
- [ ] Year filter works.
- [ ] Topic/stack filter works.
- [ ] Certificate previews/images render.
- [ ] Missing-certificate state renders intentionally.
- [ ] Certificate and verification links work.

## Terminal

- [ ] Initial banner shows current application version.
- [ ] `help` lists the current command registry.
- [ ] `help <command>` returns command-specific usage.
- [ ] `overview` works.
- [ ] `whoami` works.
- [ ] `status` works.
- [ ] `experience list/search/show/open` works.
- [ ] `projects list/search/show/open` works.
- [ ] `certifications list/search/show/open` works.
- [ ] `courses list/search/show/open` works.
- [ ] `skills list/search/open` works.
- [ ] `education` works.
- [ ] `contact` works.
- [ ] `resume` prompts before navigation.
- [ ] Numeric record selection resolves in the correct context.
- [ ] Text/ID/slug addressing works where supported.
- [ ] Invalid command returns useful help/error output.
- [ ] Y/Yes confirms navigation.
- [ ] N/No/Cancel cancels navigation.
- [ ] Escape cancels a pending prompt.
- [ ] ArrowUp/ArrowDown command history works.
- [ ] Tab autocomplete works for unique and multiple suggestions.
- [ ] Ctrl+L and clear icon clear output.
- [ ] Mobile prompt does not overflow.

## Resume

- [ ] `/resume` renders current profile data.
- [ ] Full Resume view works.
- [ ] Experience view works.
- [ ] Technical Stack view works.
- [ ] Education & Certs view works.
- [ ] Courses & Awards view works.
- [ ] Print Record works.
- [ ] Download PDF returns a valid PDF.
- [ ] **Manual:** downloaded PDF content is synchronized with the dynamic resume/current job.

## Contact

- [ ] Required name validation works.
- [ ] Invalid email is rejected.
- [ ] Required message validation works.
- [ ] Subject remains optional.
- [ ] Inquiry-type options are correct.
- [ ] Valid Formspree submission succeeds when a real test is appropriate.
- [ ] Success state is clear.
- [ ] Immediate exact duplicate is handled as intended.
- [ ] Error/rate-limit state is understandable.
- [ ] Form is usable with keyboard navigation.

## Responsive / accessibility

- [ ] Desktop ≥1280px checked.
- [ ] Laptop width checked.
- [ ] Tablet portrait/landscape emulation checked.
- [ ] Mobile ~375–430px checked.
- [ ] Header mobile menu works.
- [ ] No horizontal page overflow.
- [ ] Project diagrams are usable.
- [ ] Focus indication remains visible.
- [ ] Buttons/links have meaningful labels.
- [ ] Form labels remain associated/readable.
- [ ] Images/icons with semantic meaning have appropriate accessible text/labels where implemented.
- [ ] Contrast is acceptable in inactive/secondary text states.

## Production smoke test

- [ ] Live domain serves the new version.
- [ ] Footer version matches release.
- [ ] Terminal version matches release.
- [ ] Main critical routes return successfully.
- [ ] No obvious browser-console runtime error.
- [ ] External services critical to contact/verification are reachable.
- [ ] Documentation metadata/changelog updated for the release when required.
