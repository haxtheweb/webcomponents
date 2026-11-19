# &lt;hax-marketing-theme&gt;

A HAXcms marketing theme, first built for the haxtheweb.org site and open to anyone. It draws a header with the site's logo, name and top-level pages, a band in the palette's lead color that carries the page title, a wide content column for section blocks, a live style switcher and a footer that lists every page. Band, buttons, edges and shadows all follow the site's palette, and the chrome reads only DDD tokens, so any bridged design system fits.

What is particular to one site (logo, art, eyebrow line, payoff line, network bar) comes from that site's theme variables, not from the theme.

## What ships in the package

| Piece | Tag or file | What it is for |
| --- | --- | --- |
| Theme | `hax-marketing-theme` | The site chrome |
| Design system | `lib/FutureTravelerDesignSystem.js` (`future-traveler`) | The HAX brand as a DDD dialect, with its own default palette. Any theme that takes a design system can use it |
| Style switcher | `hax-style-switcher` | Lets a visitor swap theme, palette and design system on the live site, pick one by chance, and go back to the site's own look. Nothing is saved. In another theme it floats in the corner as the way back |
| Use case picker | `hax-use-case-picker` | Pick what a site is for and get a link that opens HAX with that starter |
| Compare | `hax-platform-compare` | Two platforms side by side, feature by feature, from a JSON file |
| Contributors | `hax-contributors` | People from a roster JSON file, drawn as rpg-characters |
| Story button | `hax-story-link` | The one button that opens the story behind a claim on hax.cloud. `site` points it at another HAX network site (`learn`, `try`, `elements`, `web`) with that site's icon; `named` shows what it is about |
| Reel | `hax-reel` | Something you click to flip to the next one: a picture, an rpg-character or a callout. `effect="glitch"` is the rpg-glitch burst; reduced motion gets a plain swap |
| Section blocks | `hax-cast`, `hax-cast-member`, `hax-pillar-strip`, `hax-pillar`, `hax-feature-row`, `hax-stat-strip`, `hax-stat`, `hax-versus`, `hax-chip` | The pieces a marketing page is assembled from |

Every block except the reel and the style switcher has a HAX editor schema in `lib/<tag>.haxProperties.json`, so pages built from them stay editable.

The header lists the top-level pages; a page with pages under it gets a menu of them, and those pages show the way back up over their title. Remix in the header restyles the site: the dice picks a look by chance, the arrow opens every option. Each page ends with the previous and next page by name, and a back to top button appears once the page has scrolled.

## Use it

On a HAXcms site, pick **HAX marketing** in the appearance settings, or set the theme in `site.json`:

```json
"theme": {
  "element": "hax-marketing-theme",
  "path": "@haxtheweb/hax-marketing-theme/hax-marketing-theme.js",
  "name": "HAX marketing",
  "designSystem": "future-traveler",
  "variables": {
    "cta": "Start building",
    "eyebrow": "Free. Open. Yours to keep.",
    "heroAction": "Pick a starter",
    "payoff": "Every era had its tools. This one's yours.",
    "legal": "Apache-2.0, the whole stack."
  }
}
```

All variables are optional. A site that sets none gets the header, the title band, the content, the switcher and the footer.

| Variable | Shows |
| --- | --- |
| `palette` | A DDD palette for the band, buttons, edges and shadows |
| `cta` | A button in the header that goes to the home page |
| `eyebrow` | A small line over the title on the home page |
| `heroAction` | A button under the home title that scrolls to the first `hax-use-case-picker`, or to the content |
| `logos` | `[{ src, alt }]`: the header logo, flipping to the next form on click |
| `art` | The round picture on the home page, flipping on click. Each entry is a picture `{ src, alt }`, a character `{ character, alt }` or a callout `{ callout, site, alt }` |
| `screens` | `[{ src, alt, name, tags }]`: a second picture over the art, with its name and tags under it |
| `stickers` | `[{ src, alt }]`: the picture beside the title on other pages. Each page starts on a different one, and a click flips to the next (`sticker`, one address, still works) |
| `remixStories` | `[{ story, about }]`: story buttons shown in the remix panel |
| `copyright` | The copyright line in the footer |
| `footerLinks` | `[{ label, url }]`: a last footer column of outside links |
| `payoff` | A line at the top of the footer |
| `legal` | A line at the bottom of the footer |
| `network` | `"hax"` adds the HAX network bar above the header |

`designSystem` is optional too. Leave it out for plain DDD.

## Blocks in page content

```html
<hax-stat-strip>
  <hax-stat end="640" suffix="+" label="components" story="webcomponents"></hax-stat>
  <hax-stat value="$0" label="Forever yours."></hax-stat>
</hax-stat-strip>

<hax-feature-row eyebrow="Edit" heading="Click the page. Type. Done." image="files/screen-edit.jpg" alt="A page in edit mode">
  <p>No admin screen between you and the page.</p>
</hax-feature-row>

<hax-platform-compare source="files/platforms.json" a="hax" b="wordpress"></hax-platform-compare>

<hax-contributors source="files/contributors.json" show="landed"></hax-contributors>

<hax-story-link story="stories/ee450a19" about="Jimmy Kane"></hax-story-link>
```

`hax-platform-compare` reads `{ "platforms": [ { "id", "name", "kind", "url" } ], "features": [ { "label", "cells": { "<platform id>": { "r": "y" | "p" | "n", "note" } } } ] }`.

`hax-contributors` reads `{ "lab": [ { "name", "work": [ { "what", "when" } ], "landed": { "org", "role" } | null, "links": [ { "kind": "github" | "linkedin" | "site", "url" } ], "github", "story" } ], "code": [ { "login", "commits" } ] }`. `show` is `landed`, `lab` or `code`. On hover or focus a card loads that person's GitHub picture from github.com; nothing is requested until then.

`hax-story-link` takes a story's address on hax.cloud (`stories/<address>`) or a web's path (`hax-lab`).

## Demo

`demo/` is the home page and the five top-level pages of the haxtheweb.org marketing site, with their pictures and data in `demo/files/`. It is demo content for this theme, not a starter site; the whole site, with the pages under these, is in [haxtheweb/haxtheweb.org](https://github.com/haxtheweb/haxtheweb.org), so links to those pages go to haxtheweb.org. One video on the pillars page plays from the haxtheweb/art repository so the file is not copied here.

To see the theme in the HAXcms editor demo, open `elements/haxcms-elements/demo/index.html?theme=hax-marketing-theme`.

## Develop

```bash
yarn run build
yarn test
hax audit
```

After changing `design-system/bridge.json` or the token file, rebuild the bridge from the monorepo root: `yarn ddd:bridge elements/hax-marketing-theme`.
