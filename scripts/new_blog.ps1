param (
    [Parameter(Mandatory=$true)]
    [string]$PostName
)

# --- MD_PROTOCOL template generator (PowerShell) ---
# Enhanced UI/UX and Validation

Write-Host "[SYSTEM_INITIALIZING] Generating MD_PROTOCOL template..." -ForegroundColor Cyan

$MdFile = "blog/$PostName.md"
$Date = Get-Date -Format "yyyy-MM-dd"

# Validation
if (Test-Path $MdFile) {
    Write-Host "[WARNING] Post $MdFile already exists." -ForegroundColor Yellow
    $Overwrite = Read-Host ">> Overwrite? (y/n)"
    if ($Overwrite -ne 'y') {
        Write-Host "[ABORTED] Operation cancelled by user." -ForegroundColor Red
        exit 0
    }
}

# 1. Create Markdown Template
Write-Host "[TASK] Constructing markdown buffer..." -ForegroundColor Cyan
$Content = @"
---
title: $($PostName.ToUpper())
date: $Date
description: ENTER_DESCRIPTION_HERE
banner: assets/blog/placeholder.png
---

## SECTION_01: INITIALIZATION
Enter content here...
"@

try {
    New-Item -Path $MdFile -ItemType File -Value $Content -Force | Out-Null
    Write-Host "[SUCCESS] CREATED_$MdFile" -ForegroundColor Green
} catch {
    Write-Host "[CRITICAL_FAILURE] Failed to write to disk: $_" -ForegroundColor Red
    exit 1
}

# 2. Update Manifest
$ManifestPath = "blog/manifest.json"
Write-Host "[TASK] Updating manifest telemetry..." -ForegroundColor Cyan

try {
    if (Test-Path $ManifestPath) {
        $Manifest = Get-Content $ManifestPath | ConvertFrom-Json
        
        $NewEntry = [PSCustomObject]@{
            file = "$PostName.md"
            title = $PostName.ToUpper()
            date = $Date
            description = "ENTER_DESCRIPTION_HERE"
        }
        
        # Prepend to array
        $NewManifest = @($NewEntry) + $Manifest
        $NewManifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $ManifestPath -Encoding utf8
        Write-Host "[SUCCESS] UPDATED_$ManifestPath" -ForegroundColor Green
    } else {
        $NewEntry = @([PSCustomObject]@{
            file = "$PostName.md"
            title = $PostName.ToUpper()
            date = $Date
            description = "ENTER_DESCRIPTION_HERE"
        })
        $NewEntry | ConvertTo-Json -Depth 10 | Out-File -FilePath $ManifestPath -Encoding utf8
        Write-Host "[SUCCESS] CREATED_$ManifestPath" -ForegroundColor Green
    }
} catch {
    Write-Host "[ERROR] Manifest update failed: $_" -ForegroundColor Red
}

Write-Host "`n>>> MISSION_STATUS: READY_FOR_EDITING" -ForegroundColor Cyan
Write-Host "Edit your post at: $MdFile" -ForegroundColor White
