# Placeholder media for the demo site

The demo site's content came from a live site, but its uploads (`files/`) are
not tracked in git, so in a fresh checkout every page that used one pointed at
a file that was not there. The pages, `site.json` and the feeds now use the
files in this folder instead, so the demo is complete wherever it is served.

- `screen-*`, `chart-*`, `scene-*`, `space-*`, `person-*`, `badge.svg`: original
  illustrations standing in for screenshots, diagrams, photos, portraits and logos.
- `sample-document.pdf`, `sample-data.csv`, `sample-audio.mp3`,
  `sample-video.mp4` and its `sample-captions.vtt`: generated stand-ins for
  uploaded documents and media.
- `animation.gif`: a copy of `elements/a11y-gif-player/lib/hax-logo-spin.gif`.

When adding demo content, put its media here or under `assets/`, not in
`files/`.
