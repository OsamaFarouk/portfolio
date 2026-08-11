param([string]$PortfolioPath = "D:\Portfolio")

. "$PSScriptRoot\shared\Portfolio-Helpers.ps1"
$report = New-StageReport -Stage "Prepare release"

try {
    Set-PortfolioLocation -Path $PortfolioPath
    Assert-CommandExists -Name "npm"
    Assert-Branch -Expected "develop"
    Assert-CleanWorkingTree
    Assert-BranchSyncedWithOrigin -Branch "develop"
    Add-ReportAction $report "Confirmed develop is clean and synchronized with origin/develop."

    $currentVersion = Get-PackageVersion
    $targetVersion = (Read-Host "Current version is $currentVersion. Enter the new version (example: 1.3.0)").Trim()
    if ($targetVersion -notmatch '^\d+\.\d+\.\d+$') {
        throw "Version must use semantic version format X.Y.Z, without the v prefix."
    }
    if ([version]$targetVersion -le [version]$currentVersion) {
        throw "The new version $targetVersion must be greater than $currentVersion."
    }

    $tag = "v$targetVersion"
    if (Test-LocalTagExists -Tag $tag) { throw "Local tag '$tag' already exists." }
    if (Test-RemoteTagExists -Tag $tag) { throw "Remote tag '$tag' already exists." }
    Add-ReportAction $report "Validated target version $targetVersion and confirmed $tag is unused."

    if (-not (Read-YesNo -Prompt "Prepare and push portfolio $tag on develop?")) {
        $report.Result = "CANCELLED"
        Add-ReportAction $report "User cancelled before changing the version."
    } else {
        Invoke-Npm -Arguments @("version", $targetVersion, "--no-git-tag-version")
        Add-ReportAction $report "Updated package version files to $targetVersion."

        $filesToStage = @("package.json")
        if (Test-Path -LiteralPath "package-lock.json" -PathType Leaf) { $filesToStage += "package-lock.json" }
        $changedFiles = @(((Get-GitOutput -Arguments @("diff", "--name-only")) -split "`r?`n") | Where-Object { $_ })
        $unexpectedFiles = @($changedFiles | Where-Object { $_ -notin $filesToStage })
        if ($unexpectedFiles.Count -gt 0) {
            throw "npm version changed unexpected files: $($unexpectedFiles -join ', '). Review them manually."
        }
        Invoke-Git -Arguments (@("add", "--") + $filesToStage)

        $message = "release: prepare portfolio $tag"
        Invoke-Git -Arguments @("commit", "-m", $message)
        Add-ReportAction $report "Created release preparation commit: $message"
        Invoke-Git -Arguments @("push", "origin", "develop")
        Add-ReportAction $report "Pushed release preparation to origin/develop."
        $report.Result = "SUCCESS"
    }
} catch {
    $report.Error = $_.Exception.Message
} finally {
    Show-StageReport $report
}

$global:LASTEXITCODE = if ($report.Result -eq "FAILED") { 1 } else { 0 }
return
