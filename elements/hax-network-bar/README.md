# &lt;hax-network-bar&gt;

The bar across the top of every site in the HAX network. Each property is an icon in its own color: the one you are on opens into a pill with its name, and hovering or focusing any of them shows a card saying what it is for. Your character comes after them and is the way to RPG me, one of HAX Art's tools. Merlin sits in the middle; Discord, GitHub, Install HAX and the Future Traveler on the right. Nothing in the bar belongs to the site under it: a site draws its own header, links and controls below.

## Usage

```html
<script
  type="module"
  src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/hax-network-bar/hax-network-bar.js"
></script>
<hax-network-bar current="learn"></hax-network-bar>
```

`current` is one of `web`, `try`, `learn`, `elements`, `art`, `cloud` or `rpg` (`browser` and `docs`, what two of them used to be called, still work).

## The network's record

What a property is called, where it lives, its color, its icon and the sentence on its card all come from one record, `HAX_NETWORK` in `lib/hax-network.js`:

| `current`  | Property       | Where                   | Color          |
| ---------- | -------------- | ----------------------- | -------------- |
| `web`      | HAXTheWeb      | haxtheweb.org           | keystoneYellow |
| `cloud`    | PRAW           | hax.cloud               | original87Pink |
| `try`      | Build now      | browser.hax.cloud       | futureLime     |
| `learn`    | Learn          | learn.hax.cloud         | skyBlue        |
| `elements` | Web components | webcomponents.hax.cloud | inventOrange   |
| `art`      | Art            | haxtheweb.github.io/art | discoveryCoral |
| `rpg`      | RPG me         | rpg-me.hax.cloud        | athertonViolet |

`order` is the order the bar lists them. RPG me is not in it: it is one of HAX Art's tools (its record says `within: "art"`), so it comes right after Art as your character, its card says it is part of Art, and the properties menu lists it under Art. It keeps its own address and stays a stand-alone tool. To add, rename or move a property, change the record; the bar, its menu and its cards follow. The strings are translated through the bar's own `t`, whose English matches the record.

The same file holds the network's own icons (`HAX_NETWORK_GLYPHS`, `haxNetworkGlyph(id)`, `HaxNetworkGlyphStyles`). Each is two tones: the main strokes carry the shape; the accent is quiet at rest and takes the property's color, and moves, when its host (an element with class `glyph-host`) is hovered or focused. Nothing moves for a visitor who asks for less motion. Another element can draw them by adding `HaxNetworkGlyphStyles` to its styles and setting `--prop` on the host.

Below 900px, and on touch screens where there is no hover, the icons fold into one menu that lists every property with its sentence, with LinkedIn, Discord, GitHub and X at its foot (`HAX_MENU_COMMUNITY`). There Discord and the default GitHub link leave the bar's right side, since the menu holds them; anything a page puts in the `post` slot stays.

## Play

The bar is playful on purpose, and all of it answers hover and keyboard focus alike. Nothing moves for a visitor who asks for less motion; the colors still change.

- **Your character** is an icon like the rest until you come by. Then the real `rpg-character` loads, lights up in RPG me's color and walks.
- **Discord** talks and **GitHub** pushes, each taking a color; **Install HAX** pops and its arrow drops in.
- **The Future Traveler** tears through every era he has been to while you hover, and goes back to today when you leave. A click keeps the next era (`remix()`, or set `traveler-era`).

### The Future Traveler across time

He has collected the best ideas of every era, so the same icon can be drawn the way each era would have drawn it. `lib/hax-future-traveler.js` holds them (`HAX_TRAVELER_ERAS`, `futureTraveler(era, tint)`, `HaxFutureTravelerStyles`), one for each style HAX's posters tell the story of the pillars in ([haxtheweb/art](https://github.com/haxtheweb/art/tree/main/haxtheweb/posters)), plus two that have no poster yet (`wartime` and `flash`), drawn for the periods learn.hax.cloud teaches in:

| `traveler-era` | Era                                            |
| -------------- | ---------------------------------------------- |
| `now`          | Today, the icon as it ships                    |
| `steam`        | 1880s steam age                                |
| `nouveau`      | 1900s modern marvel                            |
| `deco`         | 1920s roaring twenties                         |
| `wartime`      | 1940s home front poster                        |
| `tomorrow`     | 1960s world of tomorrow, in any pillar's color |
| `rainbow`      | 1970s rainbow                                  |
| `stripes`      | 1980s corporate                                |
| `neon`         | 1980s cyberpunk                                |
| `handheld`     | Handheld, four greens                          |
| `web`          | 1990s early web                                |
| `polygon`      | 32-bit polygons                                |
| `flash`        | 2000s web cartoon                              |
| `terminal`     | Terminal                                       |

The bar loads that file, and adopts its styles, the first time the traveler is hovered, focused or clicked, so a page that never touches him never downloads it. Your character's `rpg-character` loads the same way.

## Over a full platform

`<hax-network-bar compact>` is the bar for a platform with a top bar of its own (HAXcms in the browser): shorter, with no character, Merlin or Future Traveler because the editor under it has them, and with the `pre` slot in the middle for the platform's own status and functions. Below 1100px the `pre` slot takes its own row under the bar, at every width down to a phone.

```html
<hax-network-bar compact current="try">
  <span slot="pre">Running in your browser</span>
  <button slot="pre" type="button">Publish</button>
</hax-network-bar>
```

## Install HAX

Install HAX opens in place, so nobody loses the page they are on. It has a tab for every way to get HAX (`HAX_INSTALL_METHODS`): what it is, who it is best for, its quick steps with a Copy button on each command, and a link to that way's details on haxtheweb.org. Any page with the bar opens it from `#install`, or on one way's tab from `#install/<way>` (`browser`, `cli`, `nodejs`, `php`, `desktop`, `agent`).

## Merlin

The **Merlin** button (the Future Traveler, as in the HAX top bar) opens HAX's command palette with every place in the network to jump to: hax.cloud and its tours, the web components, HAXcms in your browser, Learn, the live demo, Art and its RPG me, HAXTheWeb and GitHub (`HAX_NETWORK_DESTINATIONS`). Merlin (`@haxtheweb/super-daemon`) loads the first time the button is pressed, so a page that never opens him never downloads him.

A page can add its own places. The first time Merlin opens, the bar fires `hax-network-merlin` (bubbles, composed) with `{merlin, add}`; `add({title, href, about, icon, tags})` adds one, or use `merlin.defineOption()` for anything else. hax.cloud adds every web, tile and tour this way:

```js
bar.addEventListener("hax-network-merlin", (e) => {
  e.detail.add({
    title: "Tours",
    href: "/tours",
    about: "Walks through the web",
  });
});
```

Only http(s) links and same-site paths are followed.

## The demo strip

`<hax-network-bar demo>` is the thin strip over a HAXcms demo with no backend: the network's links, a notice that nothing is saved, the browser version and Install HAX. It keeps `--haxcms-top-offset` on the page at its height so the HAXcms editor bar sits under it.

A demo's own controls go in the `pre` slot. The HAXcms element demo puts the theme, palette and design system switcher there:

```html
<hax-network-bar demo current="elements">
  <haxcms-appearance-switcher slot="pre" sync-url></haxcms-appearance-switcher>
</hax-network-bar>
```

With the slot filled the notice and the browser link use their short wording. Below 1280px the slot is hidden.

## Styling

| Variable                      | Default                | What it sets                                        |
| ----------------------------- | ---------------------- | --------------------------------------------------- |
| `--hax-network-bar-max-width` | `1440px`               | Width of the row of links, centered                 |
| `--hax-network-bar-gutter`    | `var(--ddd-spacing-8)` | Space at either end, matched to the header under it |

The bar is HAX UI dark chrome in light and dark mode, the same as the HAX editor's own top bar, so the network reads as one place.

## License

Apache-2.0
