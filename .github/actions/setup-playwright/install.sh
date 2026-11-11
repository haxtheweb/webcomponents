#!/usr/bin/env bash
# Retrying, time-boxed Playwright Chromium install for CI; see action.yml.
#
#   install.sh browser   download the Chromium build Playwright launches
#   install.sh deps      install the apt packages the job needs
#
# Environment: FONTS ("true" installs the extra fonts, cached as .deb files
# in ~/.cache/playwright-font-debs), LOG_FILE (optional file the output is
# appended to).
#
# Each attempt is capped and retried once, so a network outage costs a few
# minutes and ends in an error that names the cause, instead of apt waiting
# on DNS until the job times out. The font packages are installed from
# DEB_DIR when it has them, so once cached they need no network at all.
set -uo pipefail

MODE="${1:-}"
FONTS="${FONTS:-false}"
LOG_FILE="${LOG_FILE:-}"
ATTEMPTS=2
ATTEMPT_SECONDS=120
BACKOFF_SECONDS=20
# apt-get update alone took over two minutes while a mirror was unreachable
DEPS_ATTEMPT_SECONDS=180
# matches the path the action caches; only the font jobs use it
DEB_DIR=""
if [ "$FONTS" = "true" ]; then
  DEB_DIR="$HOME/.cache/playwright-font-debs"
fi
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

can_launch() {
  timeout 60 node -e "require('playwright').chromium.launch().then((b) => b.close()).then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });"
}

# the runner image points apt at a mirror list whose first entry is Azure's
# Ubuntu mirror; when that name stops resolving, go to the Ubuntu archive
# directly instead
use_direct_mirror() {
  echo "Switching apt from the runner's mirror list to archive.ubuntu.com" | log
  sudo find /etc/apt -name '*.sources' -o -name '*.list' |
    xargs -r sudo sed -i 's#mirror+file:/etc/apt/apt-mirrors.txt#http://archive.ubuntu.com/ubuntu/#g'
}

# .deb files saved from an earlier successful install (the action caches
# DEB_DIR per runner image and Playwright version), so a mirror outage does
# not stop the jobs that need the fonts
install_cached_debs() {
  [ -n "$DEB_DIR" ] || return 1
  compgen -G "$DEB_DIR/*.deb" >/dev/null || return 1
  echo "::group::Install cached system packages"
  sudo dpkg -i "$DEB_DIR"/*.deb 2>&1 | log
  local status=${PIPESTATUS[0]}
  echo "::endgroup::"
  [ "$status" -eq 0 ] && can_launch 2>&1 | log
}

save_debs() {
  [ -n "$DEB_DIR" ] || return 0
  mkdir -p "$DEB_DIR"
  if compgen -G "/var/cache/apt/archives/*.deb" >/dev/null; then
    cp /var/cache/apt/archives/*.deb "$DEB_DIR"/
    echo "Saved $(find "$DEB_DIR" -name '*.deb' | wc -l) packages for later runs" | log
  fi
}

install_packages() {
  if install_cached_debs; then
    echo "Installed the system packages from the cache; apt not needed" | log
    return 0
  fi
  apt_fail_fast
  ATTEMPT_SECONDS=$DEPS_ATTEMPT_SECONDS
  if ATTEMPTS=1 retry "Install Chromium system packages" "$PLAYWRIGHT" install-deps chromium; then
    save_debs
    return 0
  fi
  sleep "$BACKOFF_SECONDS"
  use_direct_mirror
  if ATTEMPTS=1 retry "Install Chromium system packages from archive.ubuntu.com" "$PLAYWRIGHT" install-deps chromium; then
    save_debs
    return 0
  fi
  echo "::error title=Playwright system packages::apt could not install the packages Chromium needs from the runner's mirrors or archive.ubuntu.com. If the log shows \"Temporary failure resolving\", the GitHub runner's network is the problem; re-run the job once it clears. After one successful run the packages are cached and later runs do not need apt."
  exit 1
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
