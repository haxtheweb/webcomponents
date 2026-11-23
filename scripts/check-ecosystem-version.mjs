#!/usr/bin/env node
/**
 * Compare the ecosystem release version in .version (written by the
 * version-match gulp task from @haxtheweb/haxcms-elements, i.e. the lerna
 * version) with every repo a release versions, as scripts/ubiquity-network.json
 * lists them (`node scripts/ubiquity-network.mjs versions` does the same).
 *
 * When one of them is already at or ahead of it (say a 26.8.1 hotfix of
 * haxcms-nodejs or create while the elements are 26.8.0 or 26.8.1), releasing at
 * .version would tag backwards and `npm publish` would fail on a version that
 * already exists. Run `yarn run release-version <x.y.z>` (then
 * `yarn run release-publish`) first so .version moves past every package.
 *
 * Checkouts are found under $HAXTHEWEB_ROOT, by default ~/haxtheweb or the
 * folder this repo sits in (../haxcms-nodejs, ...); missing ones are skipped.
 *
 *   node scripts/check-ecosystem-version.mjs           warn when a repo is ahead (exit 0)
 *   node scripts/check-ecosystem-version.mjs --strict  exit 1 when not past
 */
import process from "node:process";
import { cmdVersions } from "./ubiquity-network.mjs";

process.exitCode = cmdVersions();
