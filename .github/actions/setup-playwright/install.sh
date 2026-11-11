#!/usr/bin/env bash
# Retrying, time-boxed Playwright Chromium install for CI; see action.yml.
#
#   install.sh browser   download the Chromium build Playwright launches
#   install.sh deps      install the apt packages the job needs
#
# Environment: FONTS ("true" installs the extra fonts through apt), LOG_FILE
# (optional file the output is appended to).
#
# Each attempt is capped and retried once, so a network outage costs a few
# minutes and ends in an error that names the cause, instead of apt waiting
# on DNS until the job times out.
set -uo pipefail

MODE="${1:-}"
FONTS="${FONTS:-false}"
LOG_FILE="${LOG_FILE:-}"
ATTEMPTS=2
ATTEMPT_SECONDS=120
BACKOFF_SECONDS=20
# the binary itself rather than `yarn playwright`, so `timeout` stops the
# install and not only a yarn wrapper around it
PLAYWRIGHT="node_modules/.bin/playwright"

log() {
  if [ -n "$LOG_FILE" ]; then
    tee -a "$LOG_FILE"
  else
    cat
  fi
}

# retry DESCRIPTION COMMAND...: up to ATTEMPTS tries, each capped at
# ATTEMPT_SECONDS; returns the last exit status (124 means it timed out)
retry() {
  local what="$1"
  shift
  local attempt=1
  local status
  while true; do
    echo "::group::$what (attempt $attempt of $ATTEMPTS)"
    timeout --kill-after=10 "$ATTEMPT_SECONDS" "$@" 2>&1 | log
    status=${PIPESTATUS[0]}
    echo "::endgroup::"
    if [ "$status" -eq 0 ]; then
      return 0
    fi
    if [ "$status" -eq 124 ]; then
      echo "$what timed out after ${ATTEMPT_SECONDS}s" | log
    else
      echo "$what exited with status $status" | log
    fi
    if [ "$attempt" -ge "$ATTEMPTS" ]; then
      return "$status"
    fi
    attempt=$((attempt + 1))
    sleep "$BACKOFF_SECONDS"
  done
}

# apt's defaults wait about 20 seconds per mirror lookup and retry each file
# on several mirrors; cap that so the retry above decides the total cost
apt_fail_fast() {
  printf '%s\n' \
    'Acquire::Retries "1";' \
    'Acquire::http::Timeout "20";' \
    'Acquire::https::Timeout "20";' |
    sudo tee /etc/apt/apt.conf.d/80-ci-fail-fast >/dev/null
}

install_packages() {
  apt_fail_fast
  if ! retry "Install Chromium system packages" "$PLAYWRIGHT" install-deps chromium; then
    echo "::error title=Playwright system packages::apt could not install the packages Chromium needs. The log above shows whether the Ubuntu mirrors were unreachable (\"Temporary failure resolving\"), which is a GitHub runner network problem; re-run the job once it clears."
    exit 1
  fi
}

can_launch() {
  timeout 60 node -e "require('playwright').chromium.launch().then((b) => b.close()).then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });"
}

case "$MODE" in
  browser)
    # a hung earlier attempt can leave this lock behind, and the next
    # install then waits on it without saying so ($HOME expands in the
    # inner shell on purpose)
    # shellcheck disable=SC2016
    if ! retry "Download Chromium" bash -c 'rm -rf "$HOME/.cache/ms-playwright/__dirlock" && exec "$0" install chromium' "$PLAYWRIGHT"; then
      echo "::error title=Playwright browser download::Chromium could not be downloaded from the Playwright CDN; see the log above. Re-run the job if it was a network problem."
      exit 1
    fi
    ;;
  deps)
    if [ "$FONTS" = "true" ]; then
      install_packages
    elif can_launch 2>&1 | log; then
      echo "Chromium launches with the runner image's libraries; no apt packages needed" | log
    else
      echo "::warning title=Playwright system packages::Chromium did not launch with the runner image's libraries, so installing them through apt"
      install_packages
    fi
    ;;
  *)
    echo "usage: install.sh browser|deps" >&2
    exit 2
    ;;
esac
