# Engineering Decision Log

This file records only decisions that materially affect future maintenance.

| ID | Decision | Previous/alternative approach | Final approach | Reason / maintenance consequence |
|---|---|---|---|---|
| D-001 | Centralize portfolio content | Embed professional data directly in components | JSON datasets in `content/` + typed `dataLoader.ts` | Content additions usually avoid presentation rewrites; enables shared landing/resume/terminal data. |
| D-002 | Use Next.js App Router | Older README/tree conventions referenced `src/pages` | `src/app` routes for root, projects, courses, resume | Current source of truth; developer docs must use App Router paths. |
| D-003 | Dedicated routes for deep inventories | Put all courses/projects/resume details on home | `/courses`, `/projects/[slug]`, `/resume` | Keeps overview navigable and allows richer detail without an excessively long single component. |
| D-004 | Portfolio-specific terminal engine | Decorative input / simple command switch / Linux-like simulation ideas | Registry/context-driven `terminalEngine.ts` | Supports data querying, numeric/text selection, help, autocomplete and controlled navigation. |
| D-005 | Confirm disruptive terminal navigation | Immediate route jump | Pending Y/N confirmation with cancel/Escape | Preserves terminal context and prevents accidental departure after inspecting a record. |
| D-006 | Use Mermaid for project topology | Static architecture images only | Mermaid-capable technical diagrams | Architecture remains versionable, editable and reviewable alongside project narrative. |
| D-007 | Keep professional project details sanitized | Full internal implementation detail | Sanitized/confidential public project narratives | Protects client/environment information while still demonstrating engineering contribution. |
| D-008 | Data-driven dynamic web resume | Only static PDF | `/resume` uses shared content selectors; PDF remains separate download | Improves freshness on web, but creates a known synchronization requirement for the static artifact. |
| D-009 | Credentials as a grouped navigation domain | More crowded flat header | Credentials dropdown + certification/education/course routes | Reduces top-nav density and groups related evidence. |
| D-010 | Develop-first controlled release | Direct edits/merges to production branch | `develop` work → prepare version → final test → `main` merge/tag | Makes production promotion repeatable and blocks untested publication. |
| D-011 | Do not auto-force Git recovery | Aggressive automatic conflict resolution | Explicit blockers; no force pushes/tag overwrite; narrow confirmed package conflict case | Preserves repository safety and requires operator awareness during exceptional states. |
| D-012 | Package version is authoritative | Hard-coded UI version strings | `package.json` → `version.ts` → terminal/footer; matching annotated tag | Prevents version drift; automated tests enforce alignment. |
| D-013 | Direct HTTPS contact form | Open local email client | Client-side Formspree submission | Better visitor flow; requires provider/error/rate-limit handling and safe public configuration. |
| D-014 | Remove contact cooldown lockout | Time-based client lockout | Validation + provider behavior + immediate exact duplicate suppression | Avoids unnecessary user blocking while still reducing accidental repeated identical submission in-session. |
| D-015 | Two skill proficiency levels | More granular/ambiguous ranking | `Intermediate` and `Advanced` + years | Simpler, defensible skills representation; data validation/UI legend must remain aligned. |

## When to add a new decision

Add a decision when a future maintainer would otherwise ask “why is the architecture this way?” Examples: changing content source, route strategy, deployment branch, terminal parser model, security model, or resume-generation architecture. Do not add routine content edits as decisions.
