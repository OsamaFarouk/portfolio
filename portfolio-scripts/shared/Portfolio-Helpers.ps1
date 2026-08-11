Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-CommandExists {
    param([Parameter(Mandatory)][string]$Name)

    if ($Name -eq "npm") {
        Resolve-NpmCommand | Out-Null
        return
    }

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Resolve-NpmCommand {
    $candidates = @(
        (Get-Command "npm.cmd" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -First 1),
        (Get-Command "npm" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -First 1),
        "D:\node-portable\node-v20.12.2-win-x64\npm.cmd",
        "$env:ProgramFiles\nodejs\npm.cmd",
        "$env:LOCALAPPDATA\Programs\nodejs\npm.cmd",
        "$env:LOCALAPPDATA\Volta\bin\npm.cmd"
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
    }

    throw "npm was not found. Expected your portable npm at 'D:\node-portable\node-v20.12.2-win-x64\npm.cmd' or npm in PATH."
}

function Invoke-Git {
    param([Parameter(Mandatory)][string[]]$Arguments)

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Get-GitOutput {
    param([Parameter(Mandatory)][string[]]$Arguments)

    $output = & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
    return ($output | Out-String).Trim()
}

function Invoke-Npm {
    param([Parameter(Mandatory)][string[]]$Arguments)

    $npmCommand = Resolve-NpmCommand
    & $npmCommand @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "npm $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Get-InProgressGitOperation {
    $gitDirectory = Get-GitOutput -Arguments @("rev-parse", "--git-dir")
    $checks = [ordered]@{
        "Merge"       = @("MERGE_HEAD")
        "Rebase"      = @("rebase-merge", "rebase-apply")
        "Cherry-pick" = @("CHERRY_PICK_HEAD")
        "Revert"      = @("REVERT_HEAD")
        "Bisect"      = @("BISECT_LOG")
    }

    foreach ($operation in $checks.Keys) {
        foreach ($marker in $checks[$operation]) {
            if (Test-Path -LiteralPath (Join-Path $gitDirectory $marker)) { return $operation }
        }
    }
    return $null
}

function Get-UnmergedFiles {
    $output = Get-GitOutput -Arguments @("diff", "--name-only", "--diff-filter=U")
    if ([string]::IsNullOrWhiteSpace($output)) { return @() }
    return @(($output -split "`r?`n") | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Get-PackageVersionFromBranch {
    param([Parameter(Mandatory)][string]$Branch)

    $json = Get-GitOutput -Arguments @("show", "${Branch}:package.json")
    $package = $json | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace([string]$package.version)) {
        throw "package.json on '$Branch' does not contain a version."
    }
    return [string]$package.version
}

function Set-PortfolioLocation {
    param([string]$Path = "D:\Portfolio")

    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        throw "Portfolio folder does not exist: $Path"
    }
    Set-Location -LiteralPath $Path
    Assert-CommandExists -Name "git"
    if (-not (Test-Path -LiteralPath ".git")) {
        throw "The folder is not a Git repository: $Path"
    }
}

function Get-CurrentBranch {
    return Get-GitOutput -Arguments @("branch", "--show-current")
}

function Assert-Branch {
    param([Parameter(Mandatory)][string]$Expected)

    $actual = Get-CurrentBranch
    if ($actual -ne $Expected) {
        throw "This stage must run on '$Expected', but the current branch is '$actual'."
    }
}

function Test-WorkingTreeClean {
    return [string]::IsNullOrWhiteSpace((Get-GitOutput -Arguments @("status", "--porcelain")))
}

function Assert-CleanWorkingTree {
    if (-not (Test-WorkingTreeClean)) {
        throw "The working tree is not clean. Commit or stash your changes before continuing."
    }
}

function Get-PackageVersion {
    if (-not (Test-Path -LiteralPath "package.json" -PathType Leaf)) {
        throw "package.json was not found in the portfolio root."
    }
    $package = Get-Content -LiteralPath "package.json" -Raw | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace([string]$package.version)) {
        throw "package.json does not contain a version."
    }
    return [string]$package.version
}

function Get-PackageScripts {
    $package = Get-Content -LiteralPath "package.json" -Raw | ConvertFrom-Json
    $names = @()
    if ($null -ne $package.scripts) {
        $names = @($package.scripts.PSObject.Properties.Name)
    }
    return $names
}

function Test-LocalTagExists {
    param([Parameter(Mandatory)][string]$Tag)

    & git show-ref --verify --quiet "refs/tags/$Tag"
    $code = $LASTEXITCODE
    if ($code -eq 0) { return $true }
    if ($code -eq 1) { return $false }
    throw "Unable to check local tag '$Tag'."
}

function Test-RemoteTagExists {
    param([Parameter(Mandatory)][string]$Tag)

    $output = & git ls-remote --tags origin "refs/tags/$Tag"
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to check remote tag '$Tag'."
    }
    return -not [string]::IsNullOrWhiteSpace(($output | Out-String))
}

function Assert-BranchSyncedWithOrigin {
    param([Parameter(Mandatory)][string]$Branch)

    Invoke-Git -Arguments @("fetch", "origin", $Branch)
    $local = Get-GitOutput -Arguments @("rev-parse", $Branch)
    $remote = Get-GitOutput -Arguments @("rev-parse", "origin/$Branch")
    if ($local -ne $remote) {
        throw "'$Branch' is not synchronized with 'origin/$Branch'. Pull or push the branch first."
    }
}

function Read-YesNo {
    param([Parameter(Mandatory)][string]$Prompt)

    while ($true) {
        $answer = (Read-Host "$Prompt [Y/N]").Trim()
        if ($answer -match '^(?i:y|yes)$') { return $true }
        if ($answer -match '^(?i:n|no)$') { return $false }
        Write-Host "Please enter Y or N." -ForegroundColor Yellow
    }
}

function Read-Choice {
    param(
        [Parameter(Mandatory)][string]$Prompt,
        [Parameter(Mandatory)][string[]]$Allowed
    )

    while ($true) {
        $answer = (Read-Host "$Prompt [$($Allowed -join '/')]").Trim().ToUpperInvariant()
        if ($answer -in $Allowed) { return $answer }
        Write-Host "Please enter one of: $($Allowed -join ', ')." -ForegroundColor Yellow
    }
}

function New-StageReport {
    param([Parameter(Mandatory)][string]$Stage)

    return [ordered]@{
        Stage   = $Stage
        Result  = "FAILED"
        Started = Get-Date
        Actions = [System.Collections.Generic.List[string]]::new()
        Error   = $null
    }
}

function Add-ReportAction {
    param(
        [Parameter(Mandatory)]$Report,
        [Parameter(Mandatory)][string]$Action
    )
    $Report.Actions.Add($Action)
}

function Show-StageReport {
    param([Parameter(Mandatory)]$Report)

    $branch = "Unavailable"
    $version = "Unavailable"
    try { $branch = Get-CurrentBranch } catch { }
    try { $version = Get-PackageVersion } catch { }
    $duration = [math]::Round(((Get-Date) - $Report.Started).TotalSeconds, 1)

    Write-Host ""
    Write-Host "================ STAGE SUMMARY ================" -ForegroundColor Cyan
    Write-Host ("Stage    : {0}" -f $Report.Stage)
    $resultColor = if ($Report.Result -eq "SUCCESS") { "Green" } elseif ($Report.Result -eq "CANCELLED") { "Yellow" } else { "Red" }
    Write-Host ("Result   : {0}" -f $Report.Result) -ForegroundColor $resultColor
    Write-Host ("Branch   : {0}" -f $branch)
    Write-Host ("Version  : {0}" -f $version)
    Write-Host ("Duration : {0} seconds" -f $duration)
    Write-Host "Actions  :"
    if ($Report.Actions.Count -eq 0) {
        Write-Host "  - No changes were made."
    } else {
        foreach ($action in $Report.Actions) { Write-Host "  - $action" }
    }
    if ($Report.Error) {
        Write-Host ("Error    : {0}" -f $Report.Error) -ForegroundColor Red
    }
    Write-Host "================================================" -ForegroundColor Cyan
}
