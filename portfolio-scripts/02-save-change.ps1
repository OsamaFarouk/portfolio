param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Save completed change"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Assert-Branch -Expected "develop"

    Write-Host ""
    Invoke-Git -Arguments @("status", "--short")
    Write-Host ""
    Invoke-Git -Arguments @("diff", "--stat")

    if (Test-WorkingTreeClean) {
        $report.Result = "CANCELLED"
        Add-ReportAction $report "Nothing to commit; the working tree is clean."
    } else {
        $allowedTypes = @("feat", "fix", "content", "docs", "security", "refactor", "style", "perf", "test", "chore")
        Write-Host "Commit types: $($allowedTypes -join ', ')"
        $type = (Read-Host "Enter commit type").Trim().ToLowerInvariant()
        if ($type -notin $allowedTypes) {
            throw "Unsupported commit type '$type'."
        }

        $description = (Read-Host "Enter a short commit description (without the type)").Trim()
        if ([string]::IsNullOrWhiteSpace($description)) {
            throw "Commit description cannot be empty."
        }
        $message = "${type}: $description"
        Write-Host "Commit message: $message" -ForegroundColor Cyan

        if (-not (Read-YesNo -Prompt "Stage all current changes, commit, and push to develop?")) {
            $report.Result = "CANCELLED"
            Add-ReportAction $report "User cancelled before staging; no changes were made."
        } else {
            Invoke-Git -Arguments @("add", "-A")
            Add-ReportAction $report "Staged all current changes."
            $staged = Get-GitOutput -Arguments @("diff", "--cached", "--name-only")
            if ([string]::IsNullOrWhiteSpace($staged)) {
                throw "No staged changes were found after git add."
            }
            Invoke-Git -Arguments @("commit", "-m", $message)
            Add-ReportAction $report "Created commit: $message"
            Invoke-Git -Arguments @("push", "origin", "develop")
            Add-ReportAction $report "Pushed the commit to origin/develop."
            $report.Result = "SUCCESS"
        }
    }
} catch {
    $report.Error = $_.Exception.Message
} finally {
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
