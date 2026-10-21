/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

const escapeHTML = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// only web links and relative paths, never javascript: or data: URLs
const safeURL = (value) => {
  const url = String(value == null ? "" : value).trim();
  return /^[a-z][a-z0-9+.-]*:/i.test(url) && !/^https?:/i.test(url) ? "" : url;
};

/**
 * Light DOM fallback for a video / audio player, for RSS, markdown, bots and
 * readers without JavaScript: a link to the media and to each text track
 * (captions, subtitles, transcripts). It carries a slot name no shadow root
 * defines, so it is never drawn next to the real player, and a marker
 * attribute so the player can remove it while the page is being edited (the
 * hook writes a fresh copy on save).
 *
 * @param {Object} media source (url), sources ([{src}]), youtubeId,
 * mediaTitle, tracks ([{src, label, srclang, kind}]) and track (url)
 * @returns {String} HTML, or "" when there is nothing to link to
 */
export function a11yMediaFallbackHTML(media) {
  const sources = Array.isArray(media.sources) ? media.sources : [];
  let src = safeURL(media.source);
  for (let i = 0; !src && i < sources.length; i++) {
    src = safeURL(sources[i] && sources[i].src);
  }
  if (!src && media.youtubeId) {
    src = `https://www.youtube.com/watch?v=${encodeURIComponent(media.youtubeId)}`;
  }
  if (!src) {
    return "";
  }
  const title = media.mediaTitle || src;
  let tracks = media.tracks;
  if (typeof tracks === "string") {
    try {
      tracks = JSON.parse(tracks);
    } catch {
      tracks = [];
    }
  }
  tracks = Array.isArray(tracks) ? tracks.slice() : [];
  if (!tracks.length && media.track) {
    tracks.push({ src: media.track, kind: "subtitles" });
  }
  const items = tracks
    .map((track) => {
      const href = safeURL(track && track.src);
      if (!href) {
        return "";
      }
      const kind = track.kind === "captions" ? "Captions" : "Subtitles";
      const lang = track.label || track.srclang || track.lang || "";
      return `<li><a href="${escapeHTML(href)}">${kind}${lang ? ` (${escapeHTML(lang)})` : ""}</a></li>`;
    })
    .filter((item) => item);
  return `<div slot="prog-fallback" data-prog-fallback><p><a href="${escapeHTML(src)}">${escapeHTML(title)}</a></p>${items.length ? `<ul>${items.join("")}</ul>` : ""}</div>`;
}

/**
 * Remove the fallback from a player's light DOM, used while editing so a
 * stale copy is never saved alongside the fresh one the hook writes.
 *
 * @param {HTMLElement} el the player
 */
export function removeA11yMediaFallback(el) {
  if (!el || !el.children) {
    return;
  }
  // walk children instead of querySelectorAll: video-player overrides
  // querySelectorAll with an SSR stub that always returns [], which made this
  // a silent no-op there
  Array.from(el.children).forEach((node) => {
    if (node.hasAttribute("data-prog-fallback")) {
      node.remove();
    }
  });
}
