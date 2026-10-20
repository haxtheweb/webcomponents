# &lt;web-baseline-status&gt;

HAX-ready wrapper around the [`baseline-status`](https://github.com/web-platform-dx/baseline-status)
widget from web-platform-dx. It shows the [Baseline](https://web.dev/baseline)
browser support status of a web platform feature, and exposes the feature to
the HAX editor through `lib/web-baseline-status.haxProperties.json` (the
upstream widget has no HAX schema).

## Usage
```js
/* In an existing JS module / web component */
import "@haxtheweb/web-baseline-status/web-baseline-status.js";
```

```html
<web-baseline-status feature-id="anchor-positioning"></web-baseline-status>
```

Importing `web-baseline-status.js` registers:
- `web-baseline-status` (the upstream `baseline-status` element is registered as a side effect)

## Properties

| Property / attribute | Description |
| --- | --- |
| `featureId` / `feature-id` | ID of the feature from [web-features](https://github.com/web-platform-dx/web-features), for example `anchor-positioning` or `css-nesting`. Free text; the ID is the last part of the feature's page URL on [webstatus.dev](https://webstatus.dev). |

## Network dependency

The upstream widget fetches feature data at runtime from
`https://api.webstatus.dev/v1/features/<feature-id>`. Offline, or for an unknown
ID, it shows its own loading or unknown-feature state; this wrapper does no
fetching or caching of its own.

## Upstream

`baseline-status` 1.1.1, Apache-2.0, copyright its authors (web-platform-dx).

## Develop / Demo
Running `npm start` starts a local development server and watches JavaScript and `lib/` files.
```bash
$ npm start
```

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)
