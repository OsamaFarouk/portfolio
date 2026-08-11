param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Final testing"
$testRecordPath = $null
$previousCI = $env:CI

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Assert-CommandExists -Name "npm"
    Assert-Branch -Expected "develop"
    Assert-CleanWorkingTree
    Assert-BranchSyncedWithOrigin -Branch "develop"

    $version = Get-PackageVersion
    $commit = Get-GitOutput -Arguments @("rev-parse", "HEAD")
    $testRecordPath = Join-Path (Get-GitOutput -Arguments @("rev-parse", "--git-dir")) "portfolio-tools\final-test.json"
    $recordDirectory = Split-Path -Parent $testRecordPath
    New-Item -ItemType Directory -Path $recordDirectory -Force | Out-Null

    $availableScripts = Get-PackageScripts
    $requiredScripts = @("validate:content", "build")
    foreach ($required in $requiredScripts) {
        if ($required -notin $availableScripts) {
            throw "Required npm script '$required' is missing from package.json."
        }
    }

    $orderedChecks = @("validate:content", "lint", "typecheck", "test", "build")
    $env:CI = "true"
    foreach ($check in $orderedChecks) {
        if ($check -in $availableScripts) {
            Write-Host "Running npm script: $check" -ForegroundColor Cyan
            Invoke-Npm -Arguments @("run", $check)
            Add-ReportAction $report "Passed: npm run $check"
        } else {
            Add-ReportAction $report "Skipped unavailable optional check: npm run $check"
        }
    }

    $testRecord = [ordered]@{
        passed = $true
        version = $version
        branch = "develop"
        commit = $commit
        testedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
    }
    $testRecord | ConvertTo-Json | Set-Content -LiteralPath $testRecordPath -Encoding UTF8
    Add-ReportAction $report "Recorded successful tests for commit $($commit.Substring(0, 7)) and version $version."
    $report.Result = "SUCCESS"
} catch {
    $report.Error = $_.Exception.Message
    if ($testRecordPath) {
        $failedRecord = [ordered]@{ passed = $false; testedAtUtc = (Get-Date).ToUniversalTime().ToString("o"); error = $report.Error }
        $failedRecord | ConvertTo-Json | Set-Content -LiteralPath $testRecordPath -Encoding UTF8
    }
} finally {
    if ($null -eq $previousCI) { Remove-Item Env:CI -ErrorAction SilentlyContinue } else { $env:CI = $previousCI }
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
