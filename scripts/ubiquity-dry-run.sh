#!/bin/bash
# Copyright 2026 The Pennsylvania State University
# @license Apache-2.0, see LICENSE for full text.
#
# Run ubiquity-push.sh without changing anything: every git, npm, yarn, npx,
# uv, copy, delete and publish command it would run is written to a trace
# instead, while the checks run for real against your checkouts (preflight,
# coverage, the version gate, the site refresh in its own --dry-run, which
# CDN and npm versions have landed, and what each satellite would get).
#
#   yarn run ubiquity-dry-run                  preview the release .version holds
#   yarn run ubiquity-dry-run 26.11.0          preview 26.11.0 before release-version
#
# The full build (`yarn run ubiquity`), the outline-designer fixture capture and
# the parity release gate are logged, not run. Read-only git commands (status,
# log, ls-files, rev-parse, tag -l, ...) run, so the trace reflects your
# checkouts as they are.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
SB="$(mktemp -d "${TMPDIR:-/tmp}/ubiquity-dry-run-XXXXXX")"
TRACE="$SB/trace.log"
mkdir -p "$SB/bin"
: >"$TRACE"
REAL_GIT="$(command -v git)"
REAL_NODE="$(command -v node)"
REAL_NPM="$(command -v npm)"
export UBIQUITY_DRY_RUN=1
# preflight looks tools up on the real PATH, not the stubs
export UBIQUITY_REAL_PATH="$PATH"
export UBIQUITY_TRACE="$TRACE"
if [ "${1:-}" != "" ]; then
  export UBIQUITY_DRY_RUN_VERSION="$1"
fi

# commands that only get logged
for c in yarn npx uv cp rm mkdir tar commit-and-tag-version; do
  cat >"$SB/bin/$c" <<'EOF'
#!/bin/bash
echo "[$(basename "$PWD")] $(basename "$0") $*" >>"$UBIQUITY_TRACE"
exit 0
EOF
  chmod +x "$SB/bin/$c"
done

# commit-and-tag-version is called by path; note when the real one is missing,
# which would fail the real release in that repo
cat >"$SB/bin/commit-and-tag-version" <<'EOF'
#!/bin/bash
note=""
[ -x ./node_modules/.bin/commit-and-tag-version ] || note="  <- MISSING node_modules/.bin/commit-and-tag-version: the real run fails here"
echo "[$(basename "$PWD")] commit-and-tag-version $*$note" >>"$UBIQUITY_TRACE"
EOF
chmod +x "$SB/bin/commit-and-tag-version"

# git: read-only commands run, anything that changes a repo is logged
cat >"$SB/bin/git" <<EOF
#!/bin/bash
case "\$1" in
  status|log|diff|show|ls-files|rev-parse|symbolic-ref|cat-file|describe)
    exec "$REAL_GIT" "\$@" ;;
  branch)
    if [ "\${2:-}" = "--show-current" ]; then exec "$REAL_GIT" "\$@"; fi ;;
  tag)
    if [ "\$#" -eq 1 ] || [ "\$2" = "-l" ] || [ "\$2" = "--list" ]; then exec "$REAL_GIT" "\$@"; fi ;;
esac
echo "[\$(basename "\$PWD")] git \$*" >>"\$UBIQUITY_TRACE"
exit 0
EOF
chmod +x "$SB/bin/git"

# npm: lookups run (view, whoami); builds, installs and publishes are logged
cat >"$SB/bin/npm" <<EOF
#!/bin/bash
case "\$1" in
  # npm is a node script: run it on the real PATH, not through the node stub
  view|whoami|--version) PATH="\$UBIQUITY_REAL_PATH" exec "$REAL_NPM" "\$@" ;;
esac
echo "[\$(basename "\$PWD")] npm \$*" >>"\$UBIQUITY_TRACE"
exit 0
EOF
chmod +x "$SB/bin/npm"

# node: the release network checks and the site refresh run (the refresh in its
# own --dry-run); the landed check reports once and never stops the preview;
# every other script is logged
cat >"$SB/bin/node" <<EOF
#!/bin/bash
case "\$1" in
  *ubiquity-network.mjs)
    if [ "\${2:-}" = "landed" ]; then
      echo "[\$(basename "\$PWD")] node \$*  (checked once:)" >>"\$UBIQUITY_TRACE"
      "$REAL_NODE" "\$@" --once 2>&1 | tee -a "\$UBIQUITY_TRACE"
      exit 0
    fi
    echo "[\$(basename "\$PWD")] node \$*  (runs for real, read-only:)" >>"\$UBIQUITY_TRACE"
    "$REAL_NODE" "\$@" 2>&1 | tee -a "\$UBIQUITY_TRACE"
    exit \${PIPESTATUS[0]} ;;
  *check-ecosystem-version.mjs)
    echo "[\$(basename "\$PWD")] node \$*  (runs for real:)" >>"\$UBIQUITY_TRACE"
    "$REAL_NODE" "\$@" 2>&1 | tee -a "\$UBIQUITY_TRACE"
    exit \${PIPESTATUS[0]} ;;
  *release-publish.mjs)
    # read-only with --check; reported, and never stops the preview (before
    # release-publish it lists every element still to go out)
    echo "[\$(basename "\$PWD")] node \$*  (checked, does not stop the preview:)" >>"\$UBIQUITY_TRACE"
    "$REAL_NODE" "\$@" 2>&1 | tee -a "\$UBIQUITY_TRACE"
    exit 0 ;;
  *refresh-haxsite.mjs)
    echo "[\$(basename "\$PWD")] node \$* --dry-run  (runs for real:)" >>"\$UBIQUITY_TRACE"
    "$REAL_NODE" "\$@" --dry-run 2>&1 | tee -a "\$UBIQUITY_TRACE"
    exit \${PIPESTATUS[0]} ;;
  # inline scripts (node -e) can write files, as the haxcms-mcp changelog
  # step does, so they are logged like everything else; only a version
  # lookup runs
  --version)
    exec "$REAL_NODE" "\$@" ;;
esac
echo "[\$(basename "\$PWD")] node \$*" | cut -c1-240 >>"\$UBIQUITY_TRACE"
exit 0
EOF
chmod +x "$SB/bin/node"

# ubiquity-push.sh calls commit-and-tag-version by path; point it at the stub
sed -e 's#\./node_modules/\.bin/commit-and-tag-version#commit-and-tag-version#g' \
  "$HERE/ubiquity-push.sh" >"$SB/ubiquity-push.sh"

PATH="$SB/bin:$PATH" bash "$SB/ubiquity-push.sh" >"$SB/output.log" 2>&1
status=$?

cat "$TRACE"
echo
grep -E "ERROR|WARNING|No such file|MISSING|not found" "$SB/output.log" | sort | uniq -c
echo
if [ "$status" -eq 0 ]; then
  echo "ubiquity dry run: the release would run to the end. Trace: $TRACE"
else
  echo "ubiquity dry run: the release would STOP (exit $status) at the last step in the trace. Trace: $TRACE, output: $SB/output.log"
fi
exit "$status"
