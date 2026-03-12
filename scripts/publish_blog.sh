#!/bin/bash

# --- MD_PROTOCOL publisher ---
# Advanced Verification and Deployment Suite

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}[INITIATING_PUBLISH_PROTOCOL]${NC} Scanning assets..."

if [ -z "$1" ]; then
    echo -e "${RED}[ERROR]${NC} MISSION_POST_NAME_REQUIRED_FOR_VERIFICATION"
    exit 1
fi

POST_NAME=$1
MD_FILE="blog/${POST_NAME}.md"
MANIFEST="blog/manifest.json"

# --- 1. FILE INTEGRITY CHECKS ---
ERROR_COUNT=0

# A. Markdown File Check
echo -n "Checking markdown source... "
if [ ! -f "$MD_FILE" ]; then
    echo -e "${RED}[FAIL]${NC} ${MD_FILE}_MISSING"
    ((ERROR_COUNT++))
else
    echo -e "${GREEN}[PASS]${NC}"
fi

# B. Manifest Entry Check
echo -n "Checking manifest synchronization... "
if ! grep -q "\"file\": \"${POST_NAME}.md\"" "$MANIFEST"; then
    echo -e "${RED}[FAIL]${NC} MANIFEST_ENTRY_MISSING"
    ((ERROR_COUNT++))
else
    echo -e "${GREEN}[PASS]${NC}"
fi

# C. Banner Asset Check
echo -n "Parsing frontmatter for banner asset... "
BANNER_PATH=$(grep "banner:" "$MD_FILE" | head -1 | cut -d' ' -f2 | tr -d '\r')
if [ -z "$BANNER_PATH" ]; then
    echo -e "${YELLOW}[WARN]${NC} NO_BANNER_DEFINED_IN_FRONTMATTER"
else
    echo -n "Checking banner source: $BANNER_PATH... "
    if [[ ! "$BANNER_PATH" =~ ^http ]] && [ ! -f "$BANNER_PATH" ]; then
        echo -e "${RED}[FAIL]${NC} ASSET_MISSING_${BANNER_PATH}"
        ((ERROR_COUNT++))
    else
        echo -e "${GREEN}[PASS]${NC}"
    fi
fi

# --- 2. FINAL VERIFICATION ---
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "\n${RED}[CRITICAL_FAILURE]${NC} $ERROR_COUNT health check(s) failed."
    echo "Publication protocol aborted. Please resolve the above errors."
    exit 1
fi

echo -e "\n${GREEN}[SUCCESS]${NC} INTEGRITY_VERIFIED. Proceeding to deployment."

# --- 3. DEPLOYMENT SEQUENCE ---
echo -e "${CYAN}[TASK]${NC} Executing Git Atomic Sync..."

try_git() {
    "$@"
    if [ $? -ne 0 ]; then
        echo -e "${RED}[GIT_ERROR]${NC} Command failed: $*"
        exit 1
    fi
}

try_git git add .
try_git git commit -m "CONTENT: Add [${POST_NAME}] article"
try_git git push origin main --force

echo -e "\n${GREEN}[MISSION_COMPLETE]${NC} BLOG_DEPLOYED_SUCCESSFULLY"
echo -e "${CYAN}LIVE_URL:${NC} https://manojpisini.github.io/post.html?src=${POST_NAME}.md"
