#!/bin/bash

# Script to fix @haxtheweb/utils conflicts by removing devDependencies entries
# while preserving the runtime dependencies entries

echo "🔧 Fixing @haxtheweb/utils conflicts by removing devDependencies entries"
echo "📂 Working in: $(pwd)/elements"
echo ""

# Keep track of changes
changes_made=0
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"

# Function to fix a single package.json file
fix_package_json() {
    local file="$1"
    
    echo "🔍 Checking: $file"
    
    # Check if file has utils in both dependencies and devDependencies
    has_deps=$(jq -r '.dependencies."@haxtheweb/utils" // empty' "$file")
    has_dev_deps=$(jq -r '.devDependencies."@haxtheweb/utils" // empty' "$file")
    
    if [[ -n "$has_deps" && -n "$has_dev_deps" ]]; then
        echo "  ✅ Found conflict - has utils in both sections"
        echo "  📋 Runtime dependency: $has_deps"
        echo "  📋 Dev dependency: $has_dev_deps"
        
        # Create backup
        mkdir -p "$backup_dir/$(dirname "$file")"
        cp "$file" "$backup_dir/$file"
        
        # Remove the devDependencies entry for @haxtheweb/utils
        jq 'del(.devDependencies."@haxtheweb/utils")' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
        
        echo "  🔧 Removed devDependencies entry, kept runtime dependency"
        ((changes_made++))
        echo ""
    else
        echo "  ⏭️  No conflict found"
        echo ""
    fi
}

# Find all package.json files in elements/ and process them
find elements/ -name "package.json" -type f | while read -r file; do
    fix_package_json "$file"
done

echo "=================================================="
echo "✅ Processing complete!"
echo "📊 Files modified: $changes_made"
echo "💾 Backups created in: $backup_dir"
echo ""
echo "🔍 To verify changes:"
echo "   ./find-double-utils.sh"
echo ""
echo "🔄 To restore all changes:"
echo "   cp -r $backup_dir/* ./"
echo "   rm -rf $backup_dir"