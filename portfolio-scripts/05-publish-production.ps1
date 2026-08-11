param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Publish to production"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Assert-Branch -Expected "develop"
    Assert-CleanWorkingTree
    Assert-BranchSyncedWithOrigin -Branch "develop"

    $version = Get-PackageVersion
    if ($version -notmatch '^\d+\.\d+\.\d+$') {
        throw "package.json version '$version' is not a valid X.Y.Z release version."
    }
    $tag = "v$version"
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

        Invoke-Git -Arguments @("merge", "--no-ff", "develop", "-m", "release: merge portfolio $tag")
        Add-ReportAction $report "Merged develop into main for $tag."
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
    $report.Error = $_.Exception.Message
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
