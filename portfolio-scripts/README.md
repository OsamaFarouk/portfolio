# Portfolio PowerShell Workflow

These scripts automate the portfolio workflow on Windows while keeping each Git and release stage separate and reviewable.

## Files

- `01-start-working.ps1` — opens `D:\Portfolio`, switches to `develop`, and pulls with fast-forward only.
- `02-save-change.ps1` — asks for a commit type and description, stages the reviewed changes, commits, and pushes to `develop`.
- `03-prepare-release.ps1` — asks once for the new `X.Y.Z` version, updates the npm version files, commits, and pushes to `develop`.
- `04-final-testing.ps1` — runs `validate:content` and `build`, plus `lint`, `typecheck`, and `test` when those npm scripts exist.
- `05-publish-production.ps1` — reads the version from `package.json`, verifies the matching final-test record, merges into `main`, pushes, creates the matching annotated tag, and returns to `develop`.
- `Portfolio-Menu.ps1` — provides one menu for launching all five stages.
- `shared/Portfolio-Helpers.ps1` — shared validation, command, and summary-report functions.

Every executable script prints a final summary with the result, current branch, package version, duration, completed actions, and any error.

## Install in the portfolio

Copy the complete `portfolio-scripts` folder into:

```text
D:\Portfolio\portfolio-scripts
```

The scripts default to `D:\Portfolio`. To use another location, pass `-PortfolioPath`.

## Run the menu

From PowerShell:

```powershell
cd "D:\Portfolio\portfolio-scripts"
.\Portfolio-Menu.ps1
```

Or run an individual stage:

```powershell
.\01-start-working.ps1
.\02-save-change.ps1
.\03-prepare-release.ps1
.\04-final-testing.ps1
.\05-publish-production.ps1
```

If Windows blocks local scripts for the current PowerShell process, use:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

This changes the policy only for the current PowerShell window.

## Recommended order

1. Run `01-start-working.ps1` at the start of an editing session.
2. Run `02-save-change.ps1` after each meaningful completed change.
3. Run `03-prepare-release.ps1` once, only when the full release is ready.
4. Run `04-final-testing.ps1` after preparing the release.
5. Run `05-publish-production.ps1` only after final testing passes.

## Safety behavior

- No force-pushes or tag overwrites.
- No automatic merge-conflict resolution.
- Release preparation requires a clean, synchronized `develop` branch.
- Publishing reads the version from `package.json`; it does not ask for it again.
- Publishing requires a successful final-test record for the exact current version and commit.
- A failed publish stops on the current branch for inspection and reports completed steps.

