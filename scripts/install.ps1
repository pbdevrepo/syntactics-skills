#Requires -Version 5.1
[CmdletBinding()]
param(
    [string[]]$Workflow = @(),
    [string[]]$Skill    = @()
)
$ErrorActionPreference = 'Stop'

$Repo     = "pbdevrepo/syntactics-skills"
$ZipUrl   = "https://github.com/$Repo/releases/latest/download/syntactics-skills.zip"
$SkillDir = Join-Path $HOME ".claude\skills"
$TmpZip   = Join-Path $env:TEMP "syntactics-skills-$PID.zip"
$TmpDir   = Join-Path $env:TEMP "syntactics-skills-$PID"

function Copy-Skills {
    param([string[]]$Names, [string]$Target)
    $n = 0
    foreach ($name in $Names) {
        $src = Join-Path $TmpDir $name
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination (Join-Path $Target $name) -Recurse -Force
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

    $manifest    = Get-Content (Join-Path $TmpDir "manifest.json") -Raw | ConvertFrom-Json
    $allWorkflows = $manifest.workflows | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

    # must-have skills are always installed
    $mustHave = @()
    if ($allWorkflows -contains 'must-have') {
        $mustHave = @($manifest.workflows.'must-have')
    }

    $selected = @()

    if ($Skill.Count -gt 0) {
        $selected = $Skill | ForEach-Object { if ($_ -notmatch '^sync-') { "sync-$_" } else { $_ } }

    } elseif ($Workflow.Count -gt 0) {
        foreach ($wf in $Workflow) {
            $key = $wf -replace '-workflow$', ''
            $wfSkills = $manifest.workflows.$key
            if ($null -eq $wfSkills) {
                $avail = ($allWorkflows | Where-Object { $_ -ne 'must-have' }) -join ', '
                Write-Warning "Workflow not found: $key  (available: $avail)"
            } else {
                $selected += @($wfSkills)
            }
        }

    } else {
        # Interactive menu — must-have is hidden (always installed)
        $opts = @($allWorkflows | Where-Object { $_ -ne 'must-have' })

        Write-Host ""
        Write-Host "Available workflows:"
        for ($i = 0; $i -lt $opts.Count; $i++) {
            $wf  = $opts[$i]
            $cnt = @($manifest.workflows.$wf).Count
            Write-Host ("  [{0}] {1}-workflow ({2} skills)" -f ($i + 1), $wf, $cnt)
        }
        $allNum = $opts.Count + 1
        Write-Host ("  [{0}] All (default)" -f $allNum)

        $answer = Read-Host ("`nEnter numbers separated by commas [{0}]" -f $allNum)
        if ([string]::IsNullOrWhiteSpace($answer) -or $answer.Trim() -eq "$allNum") {
            foreach ($wf in $opts) { $selected += @($manifest.workflows.$wf) }
        } else {
            foreach ($part in ($answer -split ',')) {
                $idx = [int]$part.Trim() - 1
                if ($idx -ge 0 -and $idx -lt $opts.Count) {
                    $selected += @($manifest.workflows.($opts[$idx]))
                }
            }
        }
    }

    # Merge must-have + selected, deduplicated
    $all = ($mustHave + $selected) | Select-Object -Unique

    New-Item -ItemType Directory -Force -Path $SkillDir | Out-Null
    $count = Copy-Skills -Names $all -Target $SkillDir

    Write-Host ""
    Write-Host "Installed $count skill(s) to $SkillDir"
    Write-Host "Previously installed skills were not removed."
    Write-Host "Restart Claude Code to load the skills."

} finally {
    if (Test-Path $TmpZip) { Remove-Item $TmpZip -Force -ErrorAction SilentlyContinue }
    if (Test-Path $TmpDir) { Remove-Item $TmpDir -Recurse -Force -ErrorAction SilentlyContinue }
}
