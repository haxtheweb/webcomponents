# retro-tv

An old CRT with channels. The cabinet (wood, bezel, knobs, LED, speaker grille), the screen (scanlines, glass, static) and the on-screen channel number live in `retro-tv`; what plays on it is a **program**: any child with a `channel` attribute. The program whose `channel` matches the set's `channel` is on air.

It is printed artwork, so it looks the same in light and dark. Motion only runs when the viewer has not asked for reduced motion and `still` is not set.

Used by `vhs-blog-theme` (channel 3, the title sequence) and the HAXcms installer, `hax-app-installer` (HAX TV, loading screens and credits).

## Usage

```html
<script type="module">
  import "@haxtheweb/retro-tv/retro-tv.js";
  import "@haxtheweb/retro-tv/lib/programs/retro-tv-hax-tv.js";
  import "@haxtheweb/retro-tv/lib/programs/retro-tv-handheld.js";
</script>
<retro-tv channel="4" controls osd-fade remember-power="my-site-tv">
  <retro-tv-hax-tv channel="4"></retro-tv-hax-tv>
  <retro-tv-handheld channel="8"></retro-tv-handheld>
  <div channel="12" label="A plain program: say what is on screen">
    ...your own markup...
  </div>
</retro-tv>
```

## retro-tv

| Attribute | Property | Default | |
| --- | --- | --- | --- |
| `channel` | `channel` | `3` | Channel on air |
| `power` | `power` | `true` | Whether the set is on |
| `still` | `still` | `false` | No motion; final frames only |
| `controls` | `controls` | `false` | The knobs become buttons: next channel and power. Without it they are decoration |
| `channel-label` | `channelLabel` | | On-screen channel text; defaults to `channel-prefix` and the number |
| `channel-prefix` | `channelPrefix` | `CH` | Word before the channel number |
| `osd-fade` | `osdFade` | `false` | Fade the channel number a moment after tuning |
| `remember-power` | `rememberPower` | | localStorage key that remembers power for this viewer |
| `next-channel-label`, `power-on-label`, `power-off-label`, `off-label` | | English | Accessible names; pass translated text |

Methods: `tune(n)`, `next()`, `previous()`, `togglePower()`, `replay()` (power on again and restart the program), `skip()` (go still). Getters: `programs` (in channel order), `program` (on air).

Events: `retro-tv-channel-changed` (`{ channel, program }`), `retro-tv-power-changed` (`{ power }`).

The screen is one image to assistive tech, named by the program on air (`screenLabel` on a built-in program, or the `label` attribute on your own).

Size it with custom properties, for example `--retro-tv-padding`, `--retro-tv-side-width`, `--retro-tv-knob-size`, `--retro-tv-osd-size`, `--retro-tv-screen-radius`; programs read `--retro-tv-program-text`, `--retro-tv-program-small` and `--retro-tv-program-title`. The defaults are the size `vhs-blog-theme` draws.

## Programs

Import each one you use from `lib/programs/`.

| Element | | Attributes |
| --- | --- | --- |
| `retro-tv-title-sequence` | An 80s title sequence: synthwave sunset, a chrome title rolling up, a Play cue | `crawl-title`, `presenter`, `kicker`, `runtime` and their labels |
| `retro-tv-hax-tv` | HAX TV: Future Traveler stickers bounce around like a screensaver | |
| `retro-tv-credits` | End credits starring the Future Traveler | `tape` (label text), `lines` property `[{ role, name }]` |
| `retro-tv-home-computer` | Early 80s home computer: a BASIC prompt types out; loading stripes while `loading` | `what`, `loading` |
| `retro-tv-handheld` | Late 80s green-screen handheld: HAX drops in | |
| `retro-tv-pc` | Early 90s DOS prompt; a progress bar fills while `loading` | `command`, `message`, `loading` |
| `retro-tv-disc` | Mid 90s disc console: a Future Traveler disc spins behind a glowing HAX | |

Every program has `channel`, `label`, `name` (`programName` for a "now playing" line) and `loading`. Program words are translated with `locales/retro-tv.<lang>.json`.

To write your own, extend `RetroTvProgram` (or `RetroTvLocalizedProgram`) from `lib/retro-tv-program.js`: `retro-tv` sets `on-air` and `still` on it, and `restart()` runs each time it goes on air.

## Art

The Future Traveler stickers and portrait in `lib/art/` come from [haxtheweb/art](https://github.com/haxtheweb/art).

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
