param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Start working"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Add-ReportAction $report "Opened $PortfolioPath."

    $currentBranch = Get-CurrentBranch
    if ($currentBranch -ne "develop" -and -not (Test-WorkingTreeClean)) {
        throw "Uncommitted changes exist on '$currentBranch'. Commit or stash them before switching branches."
    }

    Invoke-Git -Arguments @("switch", "develop")
    Add-ReportAction $report "Switched to develop."
    Invoke-Git -Arguments @("pull", "--ff-only", "origin", "develop")
    Add-ReportAction $report "Updated develop from origin using fast-forward only."

    $commit = Get-GitOutput -Arguments @("log", "-1", "--oneline")
    Add-ReportAction $report "Current commit: $commit"
    $report.Result = "SUCCESS"
} catch {
    $report.Error = $_.Exception.Message
} finally {
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
