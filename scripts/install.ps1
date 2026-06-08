#Requires -Version 5.1
[CmdletBinding()]
param(
    [string[]]$Workflow = @(),
    [string[]]$Skill    = @(),
    [switch]$Global,
    [switch]$Local
)
$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

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

function Build-SkillMap {
    param([string]$SkillsRoot)
    $map = @{}
    Get-ChildItem -Path $SkillsRoot -Directory | ForEach-Object {
        Get-ChildItem -Path $_.FullName -Directory |
            Where-Object { $_.Name -like 'sync-*' } |
            ForEach-Object { if (-not $map.ContainsKey($_.Name)) { $map[$_.Name] = $_.FullName } }
    }
    $map
}

function Write-ProgressBar {
    param([int]$Current, [int]$Total, [int]$Width = 30)
    if ($Total -eq 0) { return }
    $pct    = [int]([Math]::Round($Current * 100 / $Total))
    $filled = [int]([Math]::Round($Width * $Current / $Total))
    $bar    = ('=' * $filled).PadRight($Width)
    Write-Host ("`r[{0}] {1,3}%" -f $bar, $pct) -NoNewline
}

function Copy-Skills {
    param([string[]]$Names, [hashtable]$SkillMap, [string]$Target)
    $total    = $Names.Count
    $n        = 0
    $warnings = @()
    foreach ($name in $Names) {
        $src = $SkillMap[$name]
        if ($src) {
            $dest = Join-Path $Target $name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Copy-Item -Path $src -Destination $dest -Recurse -Force
            $n++
        } else {
            $warnings += $name
        }
        Write-ProgressBar -Current $n -Total $total
    }
    Write-Host ""
    foreach ($w in $warnings) { Write-Warning "Skill not found in package: $w" }
    $n
}

try {
    Write-Host "Downloading latest skills..."
    (New-Object System.Net.WebClient).DownloadFile($ZipUrl, $TmpZip)

    New-Item -ItemType Directory -Force -Path $TmpDir | Out-Null
    Expand-Archive -Path $TmpZip -DestinationPath $TmpDir -Force

    $SkillsRoot = Join-Path $TmpDir "syntactics-skills-main\skills"
    $SkillMap   = Build-SkillMap -SkillsRoot $SkillsRoot

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
        # Cache skill lists once — reused for both display and selection
        $wfSkillCache = @{}
        foreach ($wfDir in $wfDirs) { $wfSkillCache[$wfDir.Name] = @(Get-WorkflowSkills -WfDir $wfDir.FullName) }

        Write-Host ""
        Write-Host "Available workflows:"
        for ($i = 0; $i -lt $wfDirs.Count; $i++) {
            $wfName = $wfDirs[$i].Name -replace '-workflow$', ''
            $cnt    = $wfSkillCache[$wfDirs[$i].Name].Count
            Write-Host ("  [{0}] {1}-workflow ({2} skills)" -f ($i + 1), $wfName, $cnt)
        }
        $allNum = $wfDirs.Count + 1
        Write-Host ("  [{0}] All (default)" -f $allNum)

        $answer = Read-Host ("`nEnter numbers separated by commas [{0}]" -f $allNum)
        if ([string]::IsNullOrWhiteSpace($answer) -or $answer.Trim() -eq "$allNum") {
            foreach ($wfDir in $wfDirs) {
                $selected += $wfSkillCache[$wfDir.Name]
            }
        } else {
            foreach ($part in ($answer -split ',')) {
                $idx = [int]$part.Trim() - 1
                if ($idx -ge 0 -and $idx -lt $wfDirs.Count) {
                    $selected += $wfSkillCache[$wfDirs[$idx].Name]
                }
            }
        }
    }

    $all = ($mustHave + $selected) | Select-Object -Unique

    New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
    $count = Copy-Skills -Names $all -SkillMap $SkillMap -Target $SkillDir

    # Copy agents from agents/ in the package root
    $AgentDir   = $SkillDir -replace '\\skills$', '\agents'
    $agentsSrc  = Join-Path $TmpDir "syntactics-skills-main\agents"
    $agentCount = 0
    if (Test-Path $agentsSrc) {
        New-Item -ItemType Directory -Force -Path $AgentDir | Out-Null
        Get-ChildItem -Path $agentsSrc -Filter "*.md" | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination (Join-Path $AgentDir $_.Name) -Force
            $agentCount++
        }
        # Copy references/ subdirectory if present
        $agentsRefSrc = Join-Path $agentsSrc "references"
        if (Test-Path $agentsRefSrc) {
            $agentsRefDest = Join-Path $AgentDir "references"
            New-Item -ItemType Directory -Force -Path $agentsRefDest | Out-Null
            Get-ChildItem -Path $agentsRefSrc -Filter "*.md" | ForEach-Object {
                Copy-Item -Path $_.FullName -Destination (Join-Path $agentsRefDest $_.Name) -Force
            }
        }
    }

    Write-Host ""
    Write-Host "Installed $count skill(s) to $SkillDir"
    if ($agentCount -gt 0) {
        Write-Host "Installed $agentCount agent(s) to $AgentDir"
    }
    Write-Host "Previously installed skills were not removed."
    Write-Host "Restart Claude Code to load the skills."

} finally {
    if (Test-Path $TmpZip) { Remove-Item $TmpZip -Force -ErrorAction SilentlyContinue }
    if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse -Force -ErrorAction SilentlyContinue }
}
