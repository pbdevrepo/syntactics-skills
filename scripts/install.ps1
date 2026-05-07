#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

# Replace POINTER_PAGE_ID with the WordPress page ID from setup step 1.
# Do not upload this script to WordPress until you have done that.
$PointerUrl = "https://development.websiteprojectupdates.com/wiki/wp-json/wp/v2/pages/POINTER_PAGE_ID?_fields=content"
$SkillsDir  = Join-Path $HOME ".claude\skills"
$TmpZip     = Join-Path $env:TEMP "syntactics-skills-$PID.zip"

Write-Host "Fetching latest skills..."
try {
    $Page = Invoke-RestMethod $PointerUrl
} catch {
    Write-Error "Could not reach pointer page. Check your connection or contact your admin."
    exit 1
}

$ZipUrl = [regex]::Match($Page.content.rendered, 'https?://\S+\.zip').Value
if (-not $ZipUrl) {
    Write-Error "No ZIP URL found in pointer page. Contact your admin."
    exit 1
}

Write-Host "Downloading skills..."
Invoke-WebRequest $ZipUrl -OutFile $TmpZip

Write-Host "Installing to $SkillsDir..."
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
Expand-Archive -Path $TmpZip -DestinationPath $SkillsDir -Force
Remove-Item $TmpZip -Force

Write-Host "Done. Restart Claude Code to load the skills."
