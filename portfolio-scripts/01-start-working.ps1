param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Start working"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Add-ReportAction $report "Opened $PortfolioPath."

    $currentBranch = Get-CurrentBranch
    $operation = Get-InProgressGitOperation
    if ($operation) {
        Write-Host "A $operation operation is still in progress on '$currentBranch'." -ForegroundColor Yellow
        Write-Host "A = Abort that Git operation, then return safely to develop"
        Write-Host "L = Leave everything unchanged for manual inspection"
        $operationChoice = Read-Choice -Prompt "Choose recovery action" -Allowed @("A", "L")
        if ($operationChoice -eq "L") {
            $report.Result = "CANCELLED"
            Add-ReportAction $report "Left the in-progress $operation unchanged on $currentBranch."
            throw [System.OperationCanceledException]::new("No files or Git state were changed.")
        }

        $abortArguments = switch ($operation) {
            "Merge"       { @("merge", "--abort") }
            "Rebase"      { @("rebase", "--abort") }
            "Cherry-pick" { @("cherry-pick", "--abort") }
            "Revert"      { @("revert", "--abort") }
            "Bisect"      { @("bisect", "reset") }
        }
        Invoke-Git -Arguments $abortArguments
        Add-ReportAction $report "Aborted the in-progress $operation after your confirmation."
        $currentBranch = Get-CurrentBranch
    }

    if ($currentBranch -eq "develop" -and -not (Test-WorkingTreeClean)) {
        Write-Host "Develop already contains uncommitted work." -ForegroundColor Yellow
        Write-Host "C = Continue working with these changes (pull is skipped)"
        Write-Host "S = Stash the changes, update develop, and keep them safely stashed"
        Write-Host "L = Leave everything unchanged"
        $developChoice = Read-Choice -Prompt "Choose action" -Allowed @("C", "S", "L")

        if ($developChoice -eq "C") {
            Add-ReportAction $report "Kept the existing uncommitted work on develop; remote pull was skipped."
            $report.Result = "SUCCESS"
        } elseif ($developChoice -eq "L") {
            $report.Result = "CANCELLED"
            Add-ReportAction $report "Left the existing develop changes unchanged."
        } else {
            $stashMessage = "portfolio-workflow backup $(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
            Invoke-Git -Arguments @("stash", "push", "--include-untracked", "-m", $stashMessage)
            $stashHash = Get-GitOutput -Arguments @("rev-parse", "refs/stash")
            Add-ReportAction $report "Safely stashed develop changes as $stashMessage ($($stashHash.Substring(0, 7)))."
            Invoke-Git -Arguments @("pull", "--ff-only", "origin", "develop")
            Add-ReportAction $report "Updated develop; your previous work remains in the named stash."
            $report.Result = "SUCCESS"
        }
    } elseif ($currentBranch -ne "develop" -and -not (Test-WorkingTreeClean)) {
        Write-Host "Uncommitted work was found on '$currentBranch'." -ForegroundColor Yellow
        Write-Host "M = Move it safely to develop and keep a backup stash"
        Write-Host "S = Store it in a named stash, then switch to develop"
        Write-Host "L = Leave everything unchanged"
        $dirtyChoice = Read-Choice -Prompt "Choose recovery action" -Allowed @("M", "S", "L")

        if ($dirtyChoice -eq "L") {
            $report.Result = "CANCELLED"
            Add-ReportAction $report "Left all uncommitted work unchanged on $currentBranch."
        } else {
            $stashMessage = "portfolio-workflow transfer from $currentBranch $(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
            Invoke-Git -Arguments @("stash", "push", "--include-untracked", "-m", $stashMessage)
            $stashHash = Get-GitOutput -Arguments @("rev-parse", "refs/stash")
            Add-ReportAction $report "Created named backup stash $stashMessage ($($stashHash.Substring(0, 7)))."
            Invoke-Git -Arguments @("switch", "develop")
            Add-ReportAction $report "Switched to develop."
            Invoke-Git -Arguments @("pull", "--ff-only", "origin", "develop")
            Add-ReportAction $report "Updated develop from origin using fast-forward only."

            if ($dirtyChoice -eq "M") {
                & git stash apply $stashHash
                if ($LASTEXITCODE -ne 0) {
                    throw "The backup stash was preserved, but applying it on develop produced conflicts. Resolve them manually; no work was deleted. Stash: $stashMessage ($($stashHash.Substring(0, 7)))."
                }
                Add-ReportAction $report "Restored the same uncommitted files on develop; the backup stash was retained."
            } else {
                Add-ReportAction $report "Kept the work safely stashed; develop is clean and ready."
            }
            $report.Result = "SUCCESS"
        }
    } elseif ($report.Result -ne "CANCELLED") {
        if ($currentBranch -ne "develop") {
            Invoke-Git -Arguments @("switch", "develop")
            Add-ReportAction $report "Switched to develop."
        }
        Invoke-Git -Arguments @("pull", "--ff-only", "origin", "develop")
        Add-ReportAction $report "Updated develop from origin using fast-forward only."
        $report.Result = "SUCCESS"
    }

    if ($report.Result -eq "SUCCESS") {
        $commit = Get-GitOutput -Arguments @("log", "-1", "--oneline")
        Add-ReportAction $report "Current commit: $commit"
    }
} catch {
    if ($_.Exception -is [System.OperationCanceledException]) {
        if ($report.Result -ne "CANCELLED") { $report.Result = "CANCELLED" }
    } else {
        $report.Error = $_.Exception.Message
    }
} finally {
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
