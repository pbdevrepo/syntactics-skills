#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$Repo      = "pbdevrepo/syntactics-skills"
$ZipUrl    = "https://github.com/$Repo/releases/latest/download/syntactics-skills.zip"
$SkillsDir = Join-Path $HOME ".claude\skills"
$TmpZip    = Join-Path $env:TEMP "syntactics-skills-$PID.zip"

Write-Host "Downloading latest skills..."
Invoke-WebRequest $ZipUrl -OutFile $TmpZip

Write-Host "Installing to $SkillsDir..."
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
Expand-Archive -Path $TmpZip -DestinationPath $SkillsDir -Force
Remove-Item $TmpZip -Force

Write-Host "Done. Restart Claude Code to load the skills."
