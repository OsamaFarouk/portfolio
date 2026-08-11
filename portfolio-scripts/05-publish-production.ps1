param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Publish to production"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    $operation = Get-InProgressGitOperation
    if ($operation) {
        throw "A $operation operation is already in progress on '$(Get-CurrentBranch)'. Run Stage 1 to abort it safely, or finish it manually before publishing."
    }

    $startingBranch = Get-CurrentBranch
    if ($startingBranch -ne "develop") {
        if (-not (Test-WorkingTreeClean)) {
            throw "Stage 5 started on '$startingBranch' with uncommitted changes. Run Stage 1 first to move or stash them safely."
        }
        if (-not (Read-YesNo -Prompt "Stage 5 must start on develop. Switch from '$startingBranch' to develop now?")) {
            $report.Result = "CANCELLED"
            Add-ReportAction $report "User cancelled before switching to develop."
            throw [System.OperationCanceledException]::new("Publishing was cancelled.")
        }
        Invoke-Git -Arguments @("switch", "develop")
        Add-ReportAction $report "Switched from $startingBranch to develop."
    }

    Assert-CleanWorkingTree
    Assert-BranchSyncedWithOrigin -Branch "develop"

    $version = Get-PackageVersion
    if ($version -notmatch '^\d+\.\d+\.\d+$') {
        throw "package.json version '$version' is not a valid X.Y.Z release version."
    }
    $tag = "v$version"

    Write-Host "Develop is prepared as $tag." -ForegroundColor Cyan
    $enteredVersion = (Read-Host "Enter the production version without v").Trim()
    if ($enteredVersion -ne $version) {
        throw "Entered version '$enteredVersion' does not match develop version '$version'. Nothing was published."
    }

    $mergeMessage = (Read-Host "Enter the release merge commit message (example: release: merge portfolio $tag)").Trim()
    if ([string]::IsNullOrWhiteSpace($mergeMessage)) {
        throw "Release merge commit message cannot be empty."
    }

    if (Test-LocalTagExists -Tag $tag) { throw "Local tag '$tag' already exists." }
    if (Test-RemoteTagExists -Tag $tag) { throw "Remote tag '$tag' already exists." }

    $commit = Get-GitOutput -Arguments @("rev-parse", "HEAD")
    $testRecordPath = Join-Path (Get-GitOutput -Arguments @("rev-parse", "--git-dir")) "portfolio-tools\final-test.json"
    if (-not (Test-Path -LiteralPath $testRecordPath -PathType Leaf)) {
        throw "No final-test record was found. Run 04-final-testing.ps1 first."
    }
    $testRecord = Get-Content -LiteralPath $testRecordPath -Raw | ConvertFrom-Json
    if (-not $testRecord.passed -or $testRecord.version -ne $version -or $testRecord.commit -ne $commit) {
        throw "Final tests do not match the current develop commit and version. Run 04-final-testing.ps1 again."
    }
    Add-ReportAction $report "Verified successful final tests for $tag at commit $($commit.Substring(0, 7))."

    if (-not (Read-YesNo -Prompt "Publish portfolio $tag to production, merge develop into main, and create the tag?")) {
        $report.Result = "CANCELLED"
        Add-ReportAction $report "User cancelled before switching to main."
    } else {
        Invoke-Git -Arguments @("switch", "main")
        Add-ReportAction $report "Switched to main."
        Invoke-Git -Arguments @("pull", "--ff-only", "origin", "main")
        Add-ReportAction $report "Updated main from origin using fast-forward only."

        & git merge --no-ff develop -m $mergeMessage
        if ($LASTEXITCODE -ne 0) {
            $unmergedFiles = @(Get-UnmergedFiles)
            $knownVersionFiles = @("package.json", "package-lock.json")
            $unexpectedConflicts = @($unmergedFiles | Where-Object { $_ -notin $knownVersionFiles })

            if ($unmergedFiles.Count -gt 0 -and $unexpectedConflicts.Count -eq 0) {
                Write-Host "Git found conflicts only in the npm version files:" -ForegroundColor Yellow
                foreach ($file in $unmergedFiles) { Write-Host "  - $file" }
                Write-Host "The tested develop versions should be kept for this release." -ForegroundColor Yellow
                if (-not (Read-YesNo -Prompt "Keep the develop copies of these version files and complete the merge?")) {
                    throw "Merge remains paused on main for inspection. No push or tag was created."
                }

                Invoke-Git -Arguments (@("checkout", "--theirs", "--") + $unmergedFiles)
                Invoke-Git -Arguments (@("add", "--") + $unmergedFiles)
                Invoke-Git -Arguments @("commit", "-m", $mergeMessage)
                Add-ReportAction $report "Resolved only the known npm version-file conflicts using the tested develop copies."
                Add-ReportAction $report "Completed merge commit: $mergeMessage"
            } else {
                $conflictText = if ($unmergedFiles.Count -gt 0) { $unmergedFiles -join ", " } else { "unknown merge failure" }
                throw "The merge could not be completed automatically. Conflicts: $conflictText. No push or tag was created; inspect main manually."
            }
        } else {
            Add-ReportAction $report "Merged develop into main with commit message: $mergeMessage"
        }
        Invoke-Git -Arguments @("push", "origin", "main")
        Add-ReportAction $report "Pushed main to origin; production deployment can begin."

        Invoke-Git -Arguments @("tag", "-a", $tag, "-m", "Portfolio version $version")
        Add-ReportAction $report "Created annotated tag $tag."
        Invoke-Git -Arguments @("push", "origin", $tag)
        Add-ReportAction $report "Pushed tag $tag to origin."

        Invoke-Git -Arguments @("switch", "develop")
        Add-ReportAction $report "Returned to develop."
        $report.Result = "SUCCESS"
    }
} catch {
    if ($_.Exception -is [System.OperationCanceledException]) {
        if ($report.Result -ne "CANCELLED") { $report.Result = "CANCELLED" }
    } else {
        $report.Error = $_.Exception.Message
    }
    try {
        $current = Get-CurrentBranch
        if ($current -eq "main") {
            Add-ReportAction $report "Stopped on main for inspection; no conflict or failed step was auto-resolved."
        }
    } catch { }
} finally {
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
