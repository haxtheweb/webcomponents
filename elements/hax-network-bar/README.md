# &lt;hax-network-bar&gt;

The strip across the top of every hax.cloud site (hax.cloud, the element portfolio, the live HAXcms demo, RPG me) that links them as one network and marks the one you are on. Each site keeps its own header under it.

## Usage

```html
<script
  type="module"
  src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/hax-network-bar/hax-network-bar.js"
></script>
<hax-network-bar current="rpg"></hax-network-bar>
```

`current` is one of `cloud`, `elements`, `demo`, `rpg` or `docs`. The list of sites is `HAX_NETWORK_SITES`, exported from `hax-network-bar.js`.

## Merlin

The **Merlin** button (the Future Traveler, as in the HAX top bar) opens HAX's command palette with every place in the network to jump to: hax.cloud and its tours, the element portfolio, the live demo, RPG me, the docs and GitHub (`HAX_NETWORK_DESTINATIONS`). Merlin (`@haxtheweb/super-daemon`) loads the first time the button is pressed, so a page that never opens him never downloads him.

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

## Styling

| Variable                      | Default                | What it sets                                        |
| ----------------------------- | ---------------------- | --------------------------------------------------- |
| `--hax-network-bar-max-width` | `1440px`               | Width of the row of links, centered                 |
| `--hax-network-bar-gutter`    | `var(--ddd-spacing-8)` | Space at either end, matched to the header under it |

The strip is brand chrome: Potential midnight with white links in light and dark mode, the current site underlined in Keystone yellow, and Merlin in the same dark field the HAX top bar opens him from.

## License

Apache-2.0
