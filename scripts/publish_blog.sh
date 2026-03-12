#!/bin/bash

# --- MD_PROTOCOL publisher ---
# Usage: ./scripts/publish_blog.sh post-filename

if [ -z "$1" ]; then
    echo "ERROR: MISSION_POST_NAME_REQUIRED_FOR_VERIFICATION"
    exit 1
fi

POST_NAME=$1
MD_FILE="blog/${POST_NAME}.md"

echo "TASK: VERIFYING_INTEGRITY..."

# 1. Check if markdown exists
if [ ! -f "$MD_FILE" ]; then
    echo "ERROR: FILE_NOT_FOUND_${MD_FILE}"
    exit 1
fi

# 2. Check if mentioned in manifest
if ! grep -q "${POST_NAME}.md" "blog/manifest.json"; then
    echo "WARNING: ${MD_FILE}_NOT_FOUND_IN_MANIFEST"
    read -p ">> Proceed with push anyway? (y/n): " PROCEED
    if [ "$PROCEED" != "y" ]; then
        exit 1
    fi
fi

echo "SUCCESS: INTEGRITY_VERIFIED"

# 3. Git Operations
echo "TASK: DEPLOYING_TO_REMOTE..."
git add .
git commit -m "CONTENT: Add [${POST_NAME}] article"
git push origin main --force

echo "MISSION_COMPLETE: BLOG_DEPLOYED"
echo "URL: https://manojpisini.github.io/post.html?src=${POST_NAME}.md"
