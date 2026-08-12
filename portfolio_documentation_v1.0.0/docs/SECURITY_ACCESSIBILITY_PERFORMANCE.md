# Security, Accessibility and Performance

## 1. Security — current controls

### Verified response/security controls

- Content-Security-Policy is configured.
- `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- strict referrer policy.
- long-duration HSTS/preload configuration.
- restrictive permissions policy for camera/microphone/geolocation/topics.
- Next.js powered-by header disabled.
- external `_blank` link safety is covered by automated tests.
- content tests scan for obvious AWS access-key/private-key patterns.

### Contact controls

- client-side validation;
- honeypot field;
- exact last-success duplicate suppression in component lifetime;
- Formspree HTTPS submission;
- clear rate-limit/error states.

### Repository privacy rule

The repository is public. `draft`, `confidential`, sanitization labels and UI visibility flags are **not security boundaries**. Never commit secrets, production credentials, private client architecture, internal URLs/IPs, proprietary configs or personal data that should not be public.

### Recommended hardening

- evaluate whether CSP `'unsafe-inline'` / `'unsafe-eval'` can be reduced;
- consider centralizing client-safe integration configuration for easier environment control;
- expand secret scanning with a dedicated tool/CI action if the repository grows;
- add dependency/security scanning appropriate to a public Next.js project;
- document and periodically test recovery from compromised external links/form destinations.

## 2. Accessibility — observed implementation

The site uses recognizable buttons, links, labels, status text and explicit aria labels in at least interactive terminal controls. The contact form has visible labels and the terminal clear action includes an accessible label.

### Items requiring manual verification

The source/live audit did not constitute a WCAG conformance test. Verify:

- keyboard order through the full header/dropdown and long page;
- visible focus on every control;
- screen-reader meaning of icon-only social controls;
- alt text for certificate/company/project imagery;
- contrast of subdued blue-gray text and disabled states;
- Mermaid diagram accessibility/fallback description;
- modal/certificate-preview focus trapping and Escape behavior;
- mobile-menu focus management.

### Recommended accessibility improvement
Provide a text architecture explanation adjacent to every Mermaid diagram (already substantially present through project narrative) so technical meaning is not image/diagram-dependent.

## 3. Performance — architecture considerations

### Positive current characteristics

- content is local structured JSON rather than runtime CMS requests;
- project architecture is text-rendered Mermaid rather than many heavyweight bespoke image files;
- dedicated course/project/resume routes prevent the home surface from owning every detail interaction;
- Next.js production build enables framework optimization;
- images/assets can be served with the application rather than through many independent third-party hosts.

### Performance-sensitive areas

- Mermaid initialization/rendering on complex project diagrams;
- numerous course/certificate images on `/courses`;
- logos/badges and user portrait;
- client-side sections on the large home page;
- font loading;
- long terminal output/history;
- responsive rendering of dense grids.

### Recommended performance checks

- run Lighthouse/Web Vitals on home, `/courses`, a complex project detail and `/resume` after significant UI changes;
- ensure certificate images are appropriately sized/compressed;
- lazy-load non-critical imagery/diagram work where framework behavior allows;
- avoid shipping full-resolution certificate images when only small thumbnails are visible;
- monitor layout shift around images with unknown dimensions;
- avoid growing the root page indefinitely when a dedicated route is more appropriate.
