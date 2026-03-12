param (
    [Parameter(Mandatory=$true)]
    [string]$PostName
)

# --- MD_PROTOCOL publisher (PowerShell) ---
# Advanced Verification and Deployment Suite

Write-Host "[INITIATING_PUBLISH_PROTOCOL] Scanning assets..." -ForegroundColor Cyan

$MdFile = "blog/$PostName.md"
$ManifestPath = "blog/manifest.json"
$Errors = 0

# --- 1. FILE INTEGRITY CHECKS ---

# A. Markdown File Check
Write-Host -NoNewline "Checking markdown source... "
if (-not (Test-Path $MdFile)) {
    Write-Host "[FAIL] ${MdFile}_MISSING" -ForegroundColor Red
    $Errors++
} else {
    Write-Host "[PASS]" -ForegroundColor Green
}

# B. Manifest Entry Check
Write-Host -NoNewline "Checking manifest synchronization... "
if (-not (Test-Path $ManifestPath)) {
    Write-Host "[FAIL] MANIFEST_MISSING" -ForegroundColor Red
    $Errors++
} else {
    $ManifestContent = Get-Content $ManifestPath -Raw
    if ($ManifestContent -notmatch "$PostName.md") {
        Write-Host "[FAIL] MANIFEST_ENTRY_MISSING" -ForegroundColor Red
        $Errors++
    } else {
        Write-Host "[PASS]" -ForegroundColor Green
    }
}

# C. Banner Asset Check
Write-Host -NoNewline "Parsing frontmatter for banner asset... "
$BannerLine = Get-Content $MdFile | Select-String "banner:" | Select-Object -First 1
if ($null -eq $BannerLine) {
    Write-Host "[WARN] NO_BANNER_DEFINED_IN_FRONTMATTER" -ForegroundColor Yellow
} else {
    $BannerPath = $BannerLine.ToString().Split(":")[1].Trim()
    if ($BannerPath -match "^http") {
        Write-Host "[PASS] (External URL: $BannerPath)" -ForegroundColor Green
    } elseif (-not (Test-Path $BannerPath)) {
        Write-Host "[FAIL] ASSET_MISSING_$BannerPath" -ForegroundColor Red
        $Errors++
    } else {
        Write-Host "[PASS]" -ForegroundColor Green
    }
}

# --- 2. FINAL VERIFICATION ---
if ($Errors -gt 0) {
    Write-Host "`n[CRITICAL_FAILURE] $Errors health check(s) failed." -ForegroundColor Red
    Write-Host "Publication protocol aborted. Please resolve the above errors."
    exit 1
}

Write-Host "`n[SUCCESS] INTEGRITY_VERIFIED. Proceeding to deployment." -ForegroundColor Green

# --- 3. DEPLOYMENT SEQUENCE ---
Write-Host "[TASK] Executing Git Atomic Sync..." -ForegroundColor Cyan

function Try-Git {
    param($Command)
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[GIT_ERROR] Command failed: $Command" -ForegroundColor Red
        exit 1
    }
}

Try-Git "git add ."
Try-Git "git commit -m 'CONTENT: Add [$PostName] article'"
Try-Git "git push origin main --force"

Write-Host "`n[MISSION_COMPLETE] BLOG_DEPLOYED_SUCCESSFULLY" -ForegroundColor Green
Write-Host "LIVE_URL: https://manojpisini.github.io/post.html?src=$PostName.md" -ForegroundColor Cyan
