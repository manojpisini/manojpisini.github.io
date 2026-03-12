#!/bin/bash

# --- MD_PROTOCOL template generator ---
# Usage: ./scripts/new_blog.sh post-filename

if [ -z "$1" ]; then
    echo "ERROR: MISSION_POST_NAME_REQUIRED"
    echo "Usage: ./scripts/new_blog.sh my-cool-post"
    exit 1
fi

POST_NAME=$1
MD_FILE="blog/${POST_NAME}.md"
DATE=$(date +%Y-%m-%d)

# 1. Create Markdown Template
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

echo "SUCCESS: CREATED_${MD_FILE}"

# 2. Update Manifest (Prepend logic)
MANIFEST="blog/manifest.json"
TEMP_MANIFEST="blog/manifest_temp.json"

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
    # Check if file is empty or just []
    if [ ! -s "$MANIFEST" ] || [ "$(cat $MANIFEST)" == "[]" ]; then
        echo -e "[\n$NEW_ENTRY\n]" > "$MANIFEST"
    else
        # Standard prepend
        cat $MANIFEST | sed "2i $NEW_ENTRY," > "$TEMP_MANIFEST"
        mv "$TEMP_MANIFEST" "$MANIFEST"
    fi
    echo "SUCCESS: UPDATED_${MANIFEST}"
else
    echo -e "[\n$NEW_ENTRY\n]" > "$MANIFEST"
    echo "SUCCESS: CREATED_${MANIFEST}"
fi
