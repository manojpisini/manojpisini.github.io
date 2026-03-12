param (
    [Parameter(Mandatory=$true)]
    [string]$PostName
)

# --- MD_PROTOCOL template generator (PowerShell) ---

$MdFile = "blog/$PostName.md"
$Date = Get-Date -Format "yyyy-MM-dd"

# 1. Create Markdown Template
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

New-Item -Path $MdFile -ItemType File -Value $Content -Force
Write-Host "SUCCESS: CREATED_$MdFile" -ForegroundColor Cyan

# 2. Update Manifest
$ManifestPath = "blog/manifest.json"
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
    Write-Host "SUCCESS: UPDATED_$ManifestPath" -ForegroundColor Cyan
} else {
    $NewEntry = @([PSCustomObject]@{
        file = "$PostName.md"
        title = $PostName.ToUpper()
        date = $Date
        description = "ENTER_DESCRIPTION_HERE"
    })
    $NewEntry | ConvertTo-Json -Depth 10 | Out-File -FilePath $ManifestPath -Encoding utf8
    Write-Host "SUCCESS: CREATED_$ManifestPath" -ForegroundColor Cyan
}
