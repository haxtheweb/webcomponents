#!/bin/bash

# Script to find package.json files that have @haxtheweb/utils in BOTH dependencies and devDependencies
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ELEMENTS_DIR="${SCRIPT_DIR}/elements"

echo "🔍 Finding files with @haxtheweb/utils in BOTH dependencies AND devDependencies"
echo "📂 Working in: $ELEMENTS_DIR"
echo ""

count=0
echo "Files with BOTH regular dependencies AND devDependencies on @haxtheweb/utils:"
echo "================================================================="

find "$ELEMENTS_DIR" -name "package.json" -not -path "*/node_modules/*" | while read -r file; do
    # Check if file has utils in regular dependencies using jq
    has_dependency=$(jq -r '.dependencies."@haxtheweb/utils" // empty' "$file")
    # Check if file has utils in devDependencies using jq
    has_devdependency=$(jq -r '.devDependencies."@haxtheweb/utils" // empty' "$file")
    
    if [[ -n "$has_dependency" && -n "$has_devdependency" ]]; then
        echo "📦 $file"
        echo "   - Has utils in dependencies: ✓ ($has_dependency)"
        echo "   - Has utils in devDependencies: ✓ ($has_devdependency)"
        echo ""
        count=$((count + 1))
    fi
done

if [ $count -eq 0 ]; then
    echo "✅ No files found with utils in BOTH dependencies and devDependencies"
    echo "   This means there are no conflicts to resolve!"
else
    echo "📊 Total files with both: $count"
    echo ""
    echo "💡 These are the ONLY files where devDependencies should be changed"
    echo "   because they have a legitimate dependency conflict."
fi