#!/bin/bash

# Script to replace @haxtheweb/utils with @haxtheweb/demo-snippet in devDependencies sections only
# This preserves legitimate dependencies on utils while updating devDependencies

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ELEMENTS_DIR="${SCRIPT_DIR}/elements"

echo "🔍 Searching for package.json files with @haxtheweb/utils in devDependencies..."
echo "📂 Working in: $ELEMENTS_DIR"
echo ""

# Find all package.json files in the elements directory
find "$ELEMENTS_DIR" -name "package.json" -type f | while read -r file; do
    echo "📋 Checking: $file"
    
    # Check if the file contains @haxtheweb/utils in devDependencies section
    if grep -A 20 '"devDependencies"' "$file" | grep -q '"@haxtheweb/utils"'; then
        echo "✅ Found @haxtheweb/utils in devDependencies of $file"
        
        # Create a backup
        cp "$file" "${file}.backup"
        echo "💾 Created backup: ${file}.backup"
        
        # Use perl for more precise replacement within devDependencies section only
        perl -i -pe '
            BEGIN { $in_devdeps = 0; }
            
            # Track when we enter devDependencies section
            if (/"devDependencies"\s*:\s*\{/) {
                $in_devdeps = 1;
            }
            
            # Track when we exit devDependencies (end of object)
            if ($in_devdeps && /^\s*\}/) {
                $in_devdeps = 0;
            }
            
            # Only replace if we are in devDependencies section
            if ($in_devdeps && /"@haxtheweb\/utils"/) {
                s/"@haxtheweb\/utils":\s*"\^11\.0\.0"/"@haxtheweb\/demo-snippet": "^11.0.5"/g;
                print STDERR "  🔄 Replaced utils with demo-snippet in devDependencies\n";
            }
        ' "$file"
        
        echo "✅ Updated $file"
        echo ""
    else
        echo "⏭️  No @haxtheweb/utils in devDependencies found in $file"
    fi
done

echo ""
echo "🎉 Script completed!"
echo ""
echo "📝 Summary of changes:"
echo "   - Only devDependencies sections were modified"
echo "   - Regular dependencies on @haxtheweb/utils were preserved"
echo "   - Backup files created with .backup extension"
echo ""
echo "🔍 To verify changes, you can run:"
echo "   find \"$ELEMENTS_DIR\" -name 'package.json' -exec grep -l '@haxtheweb/demo-snippet' {} \;"
echo ""
echo "🔙 To restore from backups if needed:"
echo "   find \"$ELEMENTS_DIR\" -name 'package.json.backup' -exec sh -c 'mv \"\$1\" \"\${1%.backup}\"' _ {} \;"
