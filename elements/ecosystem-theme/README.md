# &lt;ecosystem-theme&gt;

The hax.cloud theme: the HAX ecosystem as a website. PRAW builds hax.cloud from its ecosystem webs (one page per web, tile and tour), and this theme gives every page two views.

- **Web**: the interactive [`<ecosystem-web>`](../ecosystem-web) routed to the page, with a bar to copy the page's address, and the page content below. Selecting a tile, opening a sub-web or picking a tour moves the site to that page, so the address bar is always a link to what is on screen.
- **Site**: a reading layout with the site outline, breadcrumb, eyebrow and title, a "Where this sits in the web" figure (`<ecosystem-web compact>`) and the page content.

The Web/Site choice is remembered on the viewer's device. Pages that are not part of a web open in the Site view.

Above both views:

- **The HAX network strip** ([`<hax-network-bar>`](../hax-network-bar)), with Merlin. On hax.cloud Merlin can jump to every web, tile and tour of the site as well as across the network.
- **The HAX top bar**, drawn the way the HAX editor draws its own: the dark HAX UI chrome in both color schemes, the site title and its nav, Web/Site in the middle, and the Future Traveler in the right-hand corner.
- **The welcome**, on the home page in the Web view, when the site sets `welcome`: a greeting, a button that starts a tour and one that opens Merlin.

## Page data

Each page says what it shows in `metadata.ecosystem`:

| Page   | `metadata.ecosystem`                  |
| ------ | ------------------------------------- |
| A web  | `{"web": "sdgs"}`                     |
| A tile | `{"web": "sdgs", "node": "sdg_4"}`    |
| A tour | `{"web": "main", "tour": "everyone"}` |

A page whose content starts with `<p data-eyebrow>Group</p>` shows that line above its title in the Site view.

## Site settings

`metadata.theme.variables` in site.json:

| Variable               | What it does                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ecosystemSrc`         | URL of the bundle `<ecosystem-web>` loads (default `ecosystem-webs.json`)                                               |
| `nav`                  | `[{label, slug}]` for the header; default is the top-level pages                                                        |
| `links`                | `[{label, href, kind}]`, kind `docs` (in the nav), `portfolio` or `demo` (header buttons); only http(s) links are shown |
| `welcome`              | `{title, text, tour, tourLabel}`: the home page's greeting; `tour` is the slug of the tour its first button starts      |
| `footerNote`, `footer` | A line and `[{label, href}]` links for the footer                                                                       |

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
