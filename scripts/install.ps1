#Requires -Version 5.1
[CmdletBinding()]
param(
    [string[]]$Workflow = @(),
    [string[]]$Skill    = @(),
    [switch]$Global,
    [switch]$Local
)
$ErrorActionPreference = 'Stop'

$Repo   = "pbdevrepo/syntactics-skills"
$ZipUrl = "https://github.com/$Repo/archive/refs/heads/main.zip"
$TmpZip = Join-Path $env:TEMP "syntactics-skills-$PID.zip"
$TmpDir = Join-Path $env:TEMP "syntactics-skills-$PID"

function Get-WorkflowSkills {
    param([string]$WfDir)
    Get-ChildItem -Path $WfDir -Directory |
        Where-Object { $_.Name -like 'sync-*' } |
        Select-Object -ExpandProperty Name |
        Sort-Object
}

function Copy-Skills {
    param([string[]]$Names, [string]$SkillsRoot, [string]$Target)
    $n = 0
    foreach ($name in $Names) {
        $src = Get-ChildItem -Path $SkillsRoot -Directory | ForEach-Object {
            $candidate = Join-Path $_.FullName $name
            if (Test-Path $candidate) { $candidate }
        } | Select-Object -First 1

        if ($src) {
            $dest = Join-Path $Target $name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Copy-Item -Path $src -Destination $dest -Recurse -Force
            $n++
        } else {
            Write-Warning "Skill not found in package: $name"
        }
    }
    $n
}

try {
    Write-Host "Downloading latest skills..."
    Invoke-WebRequest $ZipUrl -OutFile $TmpZip -UseBasicParsing

    New-Item -ItemType Directory -Force -Path $TmpDir | Out-Null
    Expand-Archive -Path $TmpZip -DestinationPath $TmpDir -Force

    $SkillsRoot = Join-Path $TmpDir "syntactics-skills-main\skills"

    # Determine install location
    if ($Local) {
        $SkillDir = Join-Path (Get-Location) ".claude\skills"
    } elseif ($Global) {
        $SkillDir = Join-Path $HOME ".claude\skills"
    } else {
        Write-Host ""
        Write-Host "Install location:"
        Write-Host ("  [1] Global — available in all projects ({0}\.claude\skills) (default)" -f $HOME)
        Write-Host "  [2] Local  — current project only (.\.claude\skills)"
        $locAnswer = Read-Host "`nEnter number [1]"
        if ($locAnswer.Trim() -eq '2') {
            $SkillDir = Join-Path (Get-Location) ".claude\skills"
        } else {
            $SkillDir = Join-Path $HOME ".claude\skills"
        }
    }

    $allWfDirs = Get-ChildItem -Path $SkillsRoot -Directory | Where-Object { $_.Name -like '*-workflow' }

    # must-have skills are always installed
    $mustHave = @()
    $mustHaveDir = $allWfDirs | Where-Object { $_.Name -eq 'must-have-workflow' }
    if ($mustHaveDir) {
        $mustHave = @(Get-WorkflowSkills -WfDir $mustHaveDir.FullName)
    }

    $wfDirs = @($allWfDirs | Where-Object { $_.Name -ne 'must-have-workflow' } | Sort-Object Name)

    $selected = @()

    if ($Skill.Count -gt 0) {
        $selected = $Skill | ForEach-Object { if ($_ -notmatch '^sync-') { "sync-$_" } else { $_ } }

    } elseif ($Workflow.Count -gt 0) {
        foreach ($wf in $Workflow) {
            $key = ($wf -replace '-workflow$', '') + '-workflow'
            $wfDir = $wfDirs | Where-Object { $_.Name -eq $key }
            if (-not $wfDir) {
                $avail = ($wfDirs | ForEach-Object { $_.Name -replace '-workflow$', '' }) -join ', '
                Write-Warning "Workflow not found: $($wf -replace '-workflow$', '')  (available: $avail)"
            } else {
                $selected += @(Get-WorkflowSkills -WfDir $wfDir.FullName)
            }
        }

    } else {
        Write-Host ""
        Write-Host "Available workflows:"
        for ($i = 0; $i -lt $wfDirs.Count; $i++) {
            $wfName = $wfDirs[$i].Name -replace '-workflow$', ''
            $cnt    = @(Get-WorkflowSkills -WfDir $wfDirs[$i].FullName).Count
            Write-Host ("  [{0}] {1}-workflow ({2} skills)" -f ($i + 1), $wfName, $cnt)
        }
        $allNum = $wfDirs.Count + 1
        Write-Host ("  [{0}] All (default)" -f $allNum)

        $answer = Read-Host ("`nEnter numbers separated by commas [{0}]" -f $allNum)
        if ([string]::IsNullOrWhiteSpace($answer) -or $answer.Trim() -eq "$allNum") {
            foreach ($wfDir in $wfDirs) { $selected += @(Get-WorkflowSkills -WfDir $wfDir.FullName) }
        } else {
            foreach ($part in ($answer -split ',')) {
                $idx = [int]$part.Trim() - 1
                if ($idx -ge 0 -and $idx -lt $wfDirs.Count) {
                    $selected += @(Get-WorkflowSkills -WfDir $wfDirs[$idx].FullName)
                }
            }
        }
    }

    $all = ($mustHave + $selected) | Select-Object -Unique

    New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
    $count = Copy-Skills -Names $all -SkillsRoot $SkillsRoot -Target $SkillDir

    Write-Host ""
    Write-Host "Installed $count skill(s) to $SkillDir"
    Write-Host "Previously installed skills were not removed."
    Write-Host "Restart Claude Code to load the skills."

} finally {
    if (Test-Path $TmpZip) { Remove-Item $TmpZip -Force -ErrorAction SilentlyContinue }
    if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse -Force -ErrorAction SilentlyContinue }
}
