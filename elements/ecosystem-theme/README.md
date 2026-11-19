# &lt;ecosystem-theme&gt;

The hax.cloud theme: the HAX ecosystem as a website. PRAW builds hax.cloud from its ecosystem webs (one page per web, tile and tour), and this theme gives every page two views, Network view and Content view.

- **Network view**: the interactive [`<ecosystem-web>`](../ecosystem-web) routed to the page, and the page content below. Selecting a tile, opening a sub-web or picking a tour moves the site to that page, so the address bar is always a link to what is on screen.
- **Content view**: a reading layout with the site outline, eyebrow and title, a "Where this sits in the web" figure (`<ecosystem-web compact>`) and the page content.

The choice of view is remembered on the viewer's device. Pages that are not part of a web open in the Content view.

Above both views:

- **The HAX network strip** ([`<hax-network-bar>`](../hax-network-bar)), with Merlin. On hax.cloud Merlin can jump to every web, tile and tour of the site as well as across the network.
- **One row under it**, in the look of the haxtheweb.org marketing theme (a midnight band on a yellow rule, slab type for the site name, sticker-weight controls): the site's name, which opens a menu of its places (`nav`); the breadcrumb; the two views; and the link to this view, whose address is the Copy button. HAXTheWeb, Build now and Web components are not repeated in it, since the network bar links them.
- **The welcome**, on the home page in the Network view, when the site sets `welcome`: a greeting, a button that starts a tour and one that opens Merlin.

## Embed

Add `?embed` to any page's address to draw it for an iframe on another site: the network strip, the row under it, the outline and the footer are left out, and what remains is the page's title, a link that opens the page on the site itself, the web (when the page is part of one) and the page content. Moving around the web inside the frame keeps the embed view. The `embed` attribute on the theme does the same.

```html
<iframe
  src="https://hax.cloud/stories/ee450a19?embed"
  title="James Kane IV on hax.cloud"
  loading="lazy"
  style="width:100%;height:640px;border:0"
></iframe>
```

An embed always opens in the Network view; the view a viewer chose on the site is not read or changed.

## Page data

Each page says what it shows in `metadata.ecosystem`:

| Page   | `metadata.ecosystem`                  |
| ------ | ------------------------------------- |
| A web  | `{"web": "sdgs"}`                     |
| A tile | `{"web": "sdgs", "node": "sdg_4"}`    |
| A tour | `{"web": "main", "tour": "everyone"}` |

A page whose content starts with `<p data-eyebrow>Group</p>` shows that line above its title in the Content view.

## Site settings

`metadata.theme.variables` in site.json:

| Variable               | What it does                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ecosystemSrc`         | URL of the bundle `<ecosystem-web>` loads (default `ecosystem-webs.json`)                                          |
| `nav`                  | `[{label, slug}]`: the site's places, in the menu on its name; default is the top-level pages                      |
| `welcome`              | `{title, text, tour, tourLabel}`: the home page's greeting; `tour` is the slug of the tour its first button starts |
| `footerNote`, `footer` | A line and `[{label, href}]` links for the footer                                                                  |

The footer also has a `footerPrimary` region.

## Use

```html
<script type="module">
  import "@haxtheweb/ecosystem-theme/ecosystem-theme.js";
</script>
```

Set the theme in site.json:

```json
"theme": {
  "element": "ecosystem-theme",
  "path": "@haxtheweb/ecosystem-theme/ecosystem-theme.js",
  "name": "Ecosystem"
}
```

The demo is a five-page cut of hax.cloud: the ecosystem web, the UN goals web, goal 4, Tours and the Everyone tour.

## Develop

```bash
yarn start   # demo
yarn test
```

## License

Apache-2.0, see [LICENSE](LICENSE).
