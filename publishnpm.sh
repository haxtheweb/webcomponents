#!/bin/bash
# Publishes every element package that is not on npm yet, at its package.json
# version. Safe to re-run: what is already published is skipped, transient npm
# errors are retried, and the run ends with what (if anything) is left.
# Provenance is attached when run in GitHub Actions, or with --provenance.
# Same as `yarn run release-publish`; see scripts/release-publish.mjs.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
exec node "$DIR/scripts/release-publish.mjs" "$@"
