# &lt;hax-marketing-theme&gt;

The HAXcms theme for the haxtheweb.org landing site: a top bar with the site title and top-level pages, a strip with a live style switcher, a palette band carrying the page title, the content column and a footer. The chrome reads only DDD tokens, so a site can give it any bridged design system.

The package also ships two elements the landing site uses:

- `hax-style-switcher` lets a visitor swap the site's theme, palette and design system on the live site. It writes the same theme data the appearance preview writes, keeps the pick for the browser session and saves nothing. Logged-in editors see nothing from it; they have the appearance dialog. Set `floating` to show it as a corner button.
- `hax-use-case-picker` is a HAX block. A visitor picks what their site is for and gets a link that opens HAX in the browser with that starter site, plus the matching `hax site` command.

## Use it

On a HAXcms site, pick **HAX marketing** in the appearance settings, or set the theme in `site.json`:

```json
"theme": {
  "element": "hax-marketing-theme",
  "path": "@haxtheweb/hax-marketing-theme/hax-marketing-theme.js",
  "name": "HAX marketing"
}
```

The picker in page content:

```html
<hax-use-case-picker
  source="skeletons.json"
  browser-url="https://browser.hax.cloud/"
  exclude="studio-user-template"
></hax-use-case-picker>
```

`source` is a skeleton list in the shape app-hax reads (`{ "data": [ { "title", "description", "machineName", "priority" } ] }`). The link adds `?skeleton=<machine name>&name=<site name>` to `browser-url`.

## Demo

`demo/` is the landing site itself, rendered as a visitor sees it. Try the switcher in the strip at the top; after swapping to another theme it stays reachable as the **Restyle this site** button.

To see the theme in the HAXcms editor demo with the haxcellence content, open `elements/haxcms-elements/demo/index.html?theme=hax-marketing-theme`.

## Develop

```bash
yarn run build
yarn test
hax audit
```
