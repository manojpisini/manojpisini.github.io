#!/bin/bash

# --- MD_PROTOCOL template generator ---
# Enhanced UI/UX and Validation

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}[SYSTEM_INITIALIZING]${NC} Generating MD_PROTOCOL template..."

if [ -z "$1" ]; then
    echo -e "${RED}[ERROR]${NC} MISSION_POST_NAME_REQUIRED"
    echo -e "Usage: ./scripts/new_blog.sh my-cool-post"
    exit 1
fi

POST_NAME=$1
MD_FILE="blog/${POST_NAME}.md"
DATE=$(date +%Y-%m-%d)

# Validation: Prevent overwriting existing posts unless forced
if [ -f "$MD_FILE" ]; then
    echo -e "${YELLOW}[WARNING]${NC} Post ${MD_FILE} already exists."
    read -p ">> Overwrite? (y/N): " OVERWRITE
    if [[ ! "$OVERWRITE" =~ ^[Yy]$ ]]; then
        echo -e "${RED}[ABORTED]${NC} Operation cancelled by user."
        exit 0
    fi
fi

# 1. Create Markdown Template
echo -e "${CYAN}[TASK]${NC} Constructing markdown buffer..."
cat <<EOF > "$MD_FILE"
---
title: ${POST_NAME^^}
date: ${DATE}
description: ENTER_DESCRIPTION_HERE
banner: assets/blog/placeholder.png
---

## SECTION_01: INITIALIZATION
Enter content here...

EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS]${NC} CREATED_${MD_FILE}"
else
    echo -e "${RED}[CRITICAL_FAILURE]${NC} Failed to write to disk."
    exit 1
fi

# 2. Update Manifest (Prepend logic)
MANIFEST="blog/manifest.json"
TEMP_MANIFEST="blog/manifest_temp.json"

echo -e "${CYAN}[TASK]${NC} Updating manifest telemetry..."

# Create new entry
NEW_ENTRY=$(cat <<EOF
  {
    "file": "${POST_NAME}.md",
    "title": "${POST_NAME^^}",
    "date": "${DATE}",
    "description": "ENTER_DESCRIPTION_HERE"
  }
EOF
)

# Insert at the top of the array
if [ -f "$MANIFEST" ]; then
    if [[ $(jq '.' "$MANIFEST" 2>/dev/null) == "[]" || ! -s "$MANIFEST" ]]; then
         echo -e "[\n$NEW_ENTRY\n]" > "$MANIFEST"
    else
        # Standard prepend
        cat $MANIFEST | sed "2i $NEW_ENTRY," > "$TEMP_MANIFEST"
        mv "$TEMP_MANIFEST" "$MANIFEST"
    fi
    echo -e "${GREEN}[SUCCESS]${NC} UPDATED_${MANIFEST}"
else
    echo -e "[\n$NEW_ENTRY\n]" > "$MANIFEST"
    echo -e "${GREEN}[SUCCESS]${NC} CREATED_${MANIFEST}"
fi

echo -e "\n${CYAN}>>> MISSION_STATUS: READY_FOR_EDITING${NC}"
echo -e "Edit your post at: ${MD_FILE}"
