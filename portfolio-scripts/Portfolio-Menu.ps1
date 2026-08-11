param([string]$PortfolioPath = "D:\Portfolio")

$menuStarted = Get-Date
$runs = [System.Collections.Generic.List[string]]::new()

do {
    Clear-Host
    Write-Host "Portfolio Release Workflow" -ForegroundColor Cyan
    Write-Host "1. Start working"
    Write-Host "2. Save completed change"
    Write-Host "3. Prepare release"
    Write-Host "4. Run final tests"
    Write-Host "5. Publish to production"
    Write-Host "6. Exit"
    Write-Host ""
    $choice = (Read-Host "Choose a stage").Trim()

    $scriptName = switch ($choice) {
        "1" { "01-start-working.ps1" }
        "2" { "02-save-change.ps1" }
        "3" { "03-prepare-release.ps1" }
        "4" { "04-final-testing.ps1" }
        "5" { "05-publish-production.ps1" }
        "6" { $null }
        default { "INVALID" }
    }

    if ($scriptName -eq "INVALID") {
        Write-Host "Invalid choice." -ForegroundColor Yellow
        Read-Host "Press Enter to continue" | Out-Null
    } elseif ($scriptName) {
        $scriptPath = Join-Path $PSScriptRoot $scriptName
        if (-not (Test-Path -LiteralPath $scriptPath -PathType Leaf)) {
            Write-Host "Required stage file is missing: $scriptPath" -ForegroundColor Red
            Write-Host "Replace the complete portfolio-scripts folder, not only Portfolio-Menu.ps1." -ForegroundColor Yellow
            $runs.Add("$scriptName (missing)")
            Read-Host "Press Enter to return to the menu" | Out-Null
            continue
        }
        & $scriptPath -PortfolioPath $PortfolioPath
        $runs.Add("$scriptName (exit code: $LASTEXITCODE)")
        Read-Host "Press Enter to return to the menu" | Out-Null
    }
} while ($choice -ne "6")

Write-Host ""
Write-Host "================ MENU SUMMARY =================" -ForegroundColor Cyan
Write-Host ("Session duration: {0:N1} seconds" -f ((Get-Date) - $menuStarted).TotalSeconds)
if ($runs.Count -eq 0) {
    Write-Host "No workflow stages were run."
} else {
    Write-Host "Stages launched:"
    foreach ($run in $runs) { Write-Host "  - $run" }
}
Write-Host "================================================" -ForegroundColor Cyan
