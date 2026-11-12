/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Host matching for URLs. The implementation now lives in
 * @haxtheweb/utils/lib/url.js so non-HAXcms elements (media-behaviors,
 * utils cleanVideoSource, ...) share one helper; re-exported here so existing
 * imports keep working.
 */
export { urlHostMatches } from "@haxtheweb/utils/lib/url.js";
