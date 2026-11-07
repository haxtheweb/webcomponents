#!/bin/bash
# Publishes every element package to npm.
# security: --provenance attaches a signed SLSA attestation linking each
# published tarball to the source commit and the workflow / machine that
# built it, so consumers can verify packages were not published from an
# unexpected place. It needs an OIDC-capable CI (GitHub Actions) or an npm
# account with provenance enabled; run from CI rather than a laptop.
# where am i? move to where I am. This ensures source is properly sourced
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/elements" || exit 1
for d in */ ; do
    cd "$d" || continue
    npm publish --provenance --access public
    cd ..
done
