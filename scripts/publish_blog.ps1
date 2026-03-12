param (
    [Parameter(Mandatory=$true)]
    [string]$PostName
)

# --- MD_PROTOCOL publisher (PowerShell) ---

$MdFile = "blog/$PostName.md"
$ManifestPath = "blog/manifest.json"

Write-Host "TASK: VERIFYING_INTEGRITY..." -ForegroundColor Yellow

# 1. Check if markdown exists
if (-not (Test-Path $MdFile)) {
    Write-Host "ERROR: FILE_NOT_FOUND_$MdFile" -ForegroundColor Red
    exit 1
}

# 2. Check if mentioned in manifest
$ManifestContent = Get-Content $ManifestPath -Raw
if ($ManifestContent -notmatch "$PostName.md") {
    Write-Host "WARNING: $MdFile NOT FOUND IN MANIFEST" -ForegroundColor Yellow
    $Proceed = Read-Host ">> Proceed with push anyway? (y/n)"
    if ($Proceed -ne 'y') { exit 1 }
}

Write-Host "SUCCESS: INTEGRITY_VERIFIED" -ForegroundColor Green

# 3. Git Operations
Write-Host "TASK: DEPLOYING_TO_REMOTE..." -ForegroundColor Yellow
git add .
git commit -m "CONTENT: Add [$PostName] article"
git push origin main --force

Write-Host "MISSION_COMPLETE: BLOG_DEPLOYED" -ForegroundColor Green
Write-Host "URL: https://manojpisini.github.io/post.html?src=$PostName.md" -ForegroundColor Cyan
