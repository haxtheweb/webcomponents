# &lt;hax-network-bar&gt;

The strip across the top of every hax.cloud site (hax.cloud, the element portfolio, the live HAXcms demo, RPG me) that links them as one network and marks the one you are on. Each site keeps its own header under it.

## Usage

```html
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/hax-network-bar/hax-network-bar.js"></script>
<hax-network-bar current="rpg"></hax-network-bar>
```

`current` is one of `cloud`, `elements`, `demo`, `rpg` or `docs`. The list of sites is `HAX_NETWORK_SITES`, exported from `hax-network-bar.js`.

## Styling

| Variable | Default | What it sets |
| --- | --- | --- |
| `--hax-network-bar-max-width` | `1440px` | Width of the row of links, centered |
| `--hax-network-bar-gutter` | `var(--ddd-spacing-8)` | Space at either end, matched to the header under it |

The strip is brand chrome: Potential midnight with white links in light and dark mode, the current site underlined in Keystone yellow.

## License

Apache-2.0
