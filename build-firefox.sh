#!/bin/bash

# Build script for Firefox addon store submission
# Creates a clean ZIP file without development files

VERSION=$(grep '"version"' manifest.json | cut -d'"' -f4)
FILENAME="dist/ai-prompt-injector-v${VERSION}-firefox.zip"

echo "Building Firefox addon package v${VERSION}..."

# Remove old build if exists
rm -f "$FILENAME"

# Create the ZIP using Python (cross-platform compatible)
python3 -m zipfile -c "$FILENAME" \
    manifest.json \
    *.js \
    *.html \
    *.css \
    icons/*.png \
    PRIVACY.md \
    LICENSE \
    README.md

echo "✅ Firefox addon package created: $FILENAME"
echo "📦 Size: $(du -h "$FILENAME" | cut -f1)"
echo ""
echo "Ready for submission to Firefox addon store!"