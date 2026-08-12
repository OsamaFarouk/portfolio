# Site Structure and Navigation

## 1. Route map

```text
/
├── #home            Overview / System Profile / Professional Summary
├── #about           About Operator (within overview flow)
├── #experience      Professional Experience
├── #projects        Projects & Labs
├── #skills          Skills & Technologies
├── #certifications  Certifications
├── #education       Education & Training
├── #terminal        Interactive System Terminal
└── #contact         Connect with Operator

/courses
/projects/[slug]
/resume
/resume/Osama_Farouk_DevOps_Resume.pdf
```

### Reviewed project routes

| Project | Route |
|---|---|
| AWS ECS Fargate Container Deployment | `/projects/aws-ecs-fargate-container-deployment` |
| PayHub CI/CD & Kubernetes Release Operations | `/projects/payhub-release-operations` |
| Kubernetes Observability Platform | `/projects/kubernetes-observability-platform` |
| End-to-End GitLab CI/CD with Kubernetes and Helm | `/projects/gitlab-cicd-kubernetes-helm-lab` |
| STC Enterprise Application Deployment & Observability | `/projects/stc-enterprise-cluster` |
| Highly Available AWS Web Architecture | `/projects/highly-available-aws-architecture` |

## 2. Primary header

The desktop header uses a console identity (`OSAMA@CONSOLE:~$`) as the home affordance and exposes:

- Overview
- Experience
- Projects
- Skills
- Credentials dropdown
- Contact
- Resume
- Terminal

The Credentials navigation groups credential-related destinations rather than overloading the top-level bar. Production screenshots show credentials as an active dropdown category and dedicated certification/course/education experiences underneath it.

### Navigation state

**Verified:** `Layout.tsx` centrally handles navigation and active-section state.

- If the visitor is already on `/`, section navigation uses controlled scrolling.
- If the visitor is on a dedicated route, section navigation routes back to `/#<section>`.
- Hash navigation is re-applied after initial mount using a short delay so dedicated-route returns settle before scrolling.
- ScrollSpy tracks major home sections and updates the active header state.
- Dedicated routes explicitly map active states: courses → credentials, resume → resume, project detail → projects.

This approach prevents duplicated navigation logic across every route.

## 3. Back-to-top behavior

A fixed back-to-top button appears after the visitor has scrolled beyond the initial page region. Screenshots show it in lower-right position on long sections such as Projects, Credentials, Courses, Contact and project details.

## 4. Overview structure

The opening experience is divided into two major panels:

1. **System node / operator identity** — portrait, professional title, status/availability, location/timezone, experience, social/action icons.
2. **Professional summary / platform lifecycle** — summary, snapshot metrics, primary CTAs, and a five-phase delivery lifecycle.

The lifecycle visually models:

```text
01 PLAN        → Git / GitHub / GitLab
02 BUILD       → Jenkins / GitLab CI / SonarQube
03 INFRA       → Terraform / Ansible / Bash
04 DEPLOY      → Docker / Helm / Kubernetes
05 MONITOR     → Prometheus / Grafana / ELK
```

## 5. About Operator

The About area includes:

- Professional Story
- Core Specializations
  - CI/CD & Release Engineering
  - Kubernetes & Containers
  - Infrastructure Automation
  - Observability & Operations
- Industry Experience
  - Financial Services & FinTech
  - Enterprise IT & Tech Services
  - Telecommunications
- Community Involvement
- Language Proficiency

This section is descriptive rather than a second résumé timeline: it explains professional operating context and specialization.

## 6. Experience

The experience section is a vertical timeline with expandable cards. At the reviewed revision there are seven entries. The current role is expanded and visually highlighted by default in the supplied production screenshot.

Card-level structure includes:

- company logo;
- role;
- employment/training type;
- company and client/project context;
- date range;
- location;
- expandable detail state;
- summary;
- core responsibilities;
- key contributions/achievements;
- deployment/technology stack.

## 7. Projects

Projects & Labs includes a search field, inventory count, filter controls, project cards and detail links (`INSPECT_CASE`). Filter concepts reviewed in production include:

- All Projects
- Professional
- Personal Labs
- Training Projects
- AWS / Cloud
- Kubernetes
- CI/CD
- Observability

Project-card source metadata exposes node ID/slug, category/status, year, narrative, outcome metrics, technology tags and role.

## 8. Credentials

### Certifications

Five verified-credential cards are displayed at this revision. Each includes credential artwork, name, issuer and a verification action when a verification link is configured.

### Education & Training

The home Education & Training area combines degree, award and a preview of five course records. A `VIEW ALL 23 COURSES` action opens `/courses`.

### Professional Courses

`/courses` provides:

- title/provider/topic search;
- provider filter;
- year filter;
- topic/stack filter;
- result count;
- certificate preview image where available;
- completion state;
- certificate link;
- optional external completion-verification link.

At revision 1.0.0, the course dataset contains 23 records.

## 9. Skills

The Skills & Technologies section presents six category panels, a total inventory indicator and a two-level proficiency legend:

- Intermediate — practical experience;
- Advanced — extensive hands-on experience.

Some skill rows include clickable certification badges, connecting the skill inventory to the credential layer.

## 10. Terminal

The terminal is embedded as a full home section, with the top navigation also providing direct access. It has a fixed-height scrollable output area, command prompt, Execute button, control-plane status, clear control, keyboard history and autocomplete. See `TERMINAL.md`.

## 11. Contact

Contact combines operator endpoints on the left with a secure inbound form on the right. The footer remains visible below the long-page flow and displays application version and portal health.

## 12. Responsive behavior

**Verified from source + desktop screenshots:** the layout contains responsive breakpoints, mobile-specific prompt rendering and a mobile menu path.

**Not device-verified:** This documentation audit did not include a physical phone/tablet test or a dedicated mobile screenshot set. Therefore mobile quality must be validated with browser responsive emulation and, ideally, at least one real iOS/Android device before a significant UI release.
