# External Services and Integrations

## Integration inventory

| Service | Purpose | Used by | Configuration boundary | Failure impact |
|---|---|---|---|---|
| Vercel | Production web hosting/deployment | Entire portfolio | Provider project settings; Git branch/environment config | Production deployment unavailable/stale; previous deployed build may remain online. |
| GitHub | Source control, branches, tags, CI | Development/release | Public repository + Actions workflow | Collaboration/release/CI degraded; production may not receive new source changes. |
| GitHub Actions | CI & security-audit checks | `main`, `develop`, PRs | `.github/workflows/ci.yml` | Invalid code/content can reach manual release process without hosted CI warning. |
| Formspree | Contact-form message transport | Contact section | Client POST endpoint + Formspree account/form | Form submission fails/rate-limits; direct contact endpoints remain visible. |
| Credly / issuer verification | Credential proof | Certification badges/links | URLs stored in content | Verification action unavailable; credential card still renders. |
| LinkedIn | Professional profile destination | Contact/social actions | `social-links.json` / profile data | External profile link unavailable. |
| GitHub profile/repository links | Professional/source destination | Social actions/project context | content/social links | External destination unavailable. |

## 1. Vercel

**Verified:** The reviewed production site is hosted on a `vercel.app` domain.

**Inferred:** `main` is the intended Vercel production source branch because the release workflow promotes tested code from `develop` to `main`, creates the matching version tag and the live version matches `main`.

Before changing provider settings, verify in the Vercel dashboard:

- connected repository;
- production branch;
- framework preset/build command;
- Node/runtime version;
- environment variables, if any;
- deployment protection/domain configuration.

Do not copy secrets from Vercel into documentation.

## 2. GitHub and CI

The public repository uses `main` and `develop`. GitHub Actions runs on pushes and pull requests to both branches and performs deterministic install, content validation, release-tag validation, type checking, linting, tests and production build.

This hosted pipeline is a second control layer; the controlled local PowerShell release workflow remains the intended operator flow documented in `GIT_WORKFLOW.md`.

## 3. Formspree

**Verified:** Contact submits JSON to Formspree over HTTPS from the client component.

Current safeguards include:

- required field validation;
- email-format check;
- client length limits;
- honeypot field;
- component-lifetime exact duplicate suppression for the last successful message;
- 429-specific rate-limit state;
- visible success/error feedback.

The Formspree form endpoint itself is public client configuration. Never place Formspree account credentials, API management tokens, private email routing secrets or other privileged values in source.

## 4. Credential verification

Certification records support verification URLs and badge assets. Prefer the authoritative issuer or Credly verification destination. If a credential moves to a new account/issuer URL, update content and manually test the outbound link.

## 5. Social/contact destinations

LinkedIn, GitHub, email and phone are public professional-contact data. Because the portfolio is public, every value committed to `content/` or rendered client-side should be treated as publicly discoverable.

## 6. External-link security

The automated test suite scans TS/TSX source and asserts that `target="_blank"` anchors include `rel="noopener noreferrer"`. Preserve this convention for all new external links.
