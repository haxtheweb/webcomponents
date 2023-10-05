#!/bin/bash
# script for stat generation for iam
# Initialize variables to hold total counts
total_items=0
site_counts=()
# Initialize variables to hold folder counts and site counts
site_count=0
user_count=0

# Loop through user directories to calculate valid users and sites
for user_dir in /var/www/iam/users/*; do
    if [ -d "$user_dir/sites" ]; then
        user_folders=$(find $user_dir/sites/* -maxdepth 0 -type d ! -type l 2>/dev/null | wc -l)
        if [ "$user_folders" -gt 1 ]; then
            user_name="$(basename "$user_dir")"
            # Exclude certain users from the count
            if [ "$user_name" != "bto108" ] && [ "$user_name" != "bto5009" ] && [ "$user_name" != "elms" ]; then
                user_count=$((user_count + 1))
                # Find all site.json files and process them
                for sitepath in $(find $user_dir/sites/* -maxdepth 0 -type d ! -type l 2>/dev/null); do
                    # sites.json sanity
                    if [ -f "$sitepath/site.json" ]; then
                        site_name="$(basename "$sitepath")"
                        site_items=$(jq '.items | length' "$sitepath/site.json")  # Using jq to parse JSON and count items
                        # only count things that have more than 5 pages
                        # ignore these things from a demo early on
                        if [ "$site_name" != "covid19" ] && [ "$site_name" != "test" ] && [ "$site_name" != "test3" ] && [ "$site_name" != "testing" ] && [ "$site_name" != "coronavirus" ] && [ "$site_name" != "covid-19" ]; then
                            if [ $site_items -gt 5 ]; then
                                site_count=$((site_count + 1))
                                total_items=$(($total_items + site_items))
                                siteshort="$user_name/$site_name"
                                site_counts+=("$siteshort:$site_items")
                            fi
                        fi
                    fi
                done
            fi
        fi
    fi
done

IFS=$'\n' sorted_site_counts=($(sort -k2 -nr <<<"${site_counts[*]}"))
unset IFS

# Construct JSON object for stats
stats_json="{ \"overall\": { \"site_count\": $site_count, \"user_count\": $user_count, \"total_pages\": $total_items }, \"site_counts\": {"
json_blob=""

# Construct JSON entries for individual site counts
for entry in "${sorted_site_counts[@]}"; do
    site_file="${entry%:*}"
    items_count="${entry#*:}"
    stats_json+=" \"$site_file\": $items_count,"
done

stats_json="${stats_json%,}"  # Remove trailing comma
stats_json+=" } }"  # Close JSON object

# Write stats JSON to file
echo "$stats_json" > /var/www/html/stats/stats.json