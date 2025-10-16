#!/bin/bash

# Simple script to replace @haxtheweb/utils with @haxtheweb/demo-snippet in devDependencies
# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ELEMENTS_DIR="${SCRIPT_DIR}/elements"

echo "🔧 Simple replacement of @haxtheweb/utils with @haxtheweb/demo-snippet in devDependencies"
echo "📂 Working in: $ELEMENTS_DIR"
echo ""

count=0
# Find all package.json files and process them
find "$ELEMENTS_DIR" -name "package.json" -not -path "*/node_modules/*" | while read -r file; do
    # Check if file contains @haxtheweb/utils in devDependencies section
    if grep -A 10 '"devDependencies"' "$file" | grep -q '"@haxtheweb/utils"'; then
        echo "📝 Updating: $file"
        # Create backup
        cp "$file" "${file}.simple_backup"
        
        # Use sed to replace the specific line
        sed -i 's/"@haxtheweb\/utils": "\^11\.0\.0"/"@haxtheweb\/demo-snippet": "^11.0.5"/g' "$file"
        
        count=$((count + 1))
    fi
done

echo ""
echo "✅ Processing complete!"
echo "📊 Files processed: Check the output above"
echo ""
echo "🔍 To verify changes:"
echo "   find \"$ELEMENTS_DIR\" -name 'package.json' -exec grep -l '@haxtheweb/demo-snippet' {} \\;"