# &lt;hax-consent-gate&gt;

Consent gate
> Asks a visitor before a third-party service is contacted, and stores the answer in `HaxConsent`, the one consent store every HAX element uses.

- `variant="bar"`: a bar fixed to the bottom of the page for site-wide services. HAXcms draws it whenever a site has a Google Analytics ID (`gaID`) and the visitor has not chosen yet. It stays until the visitor picks Allow or Don't allow, which carry the same weight.
- `variant="panel"`: drawn by an embedding element (`iframe-loader`, `video-player`, the social embeds) in place of its content, with one "Always allow &lt;service&gt;" choice. Nothing is requested from that host until it is allowed.

Authors do not place this element; it is hidden from the block list.

## Usage

```js
import '@haxtheweb/hax-consent-gate/hax-consent-gate.js';
```

```html
<hax-consent-gate variant="bar" service="google-analytics"></hax-consent-gate>
<hax-consent-gate variant="panel" service="google-maps"></hax-consent-gate>
<hax-consent-gate variant="panel" service="embed:example.com" host="example.com"></hax-consent-gate>
```

Elements that embed third-party content use `HaxConsentController` from `lib/hax-consent-embeds.js`:

```js
import { HaxConsentController } from '@haxtheweb/hax-consent-gate/lib/hax-consent-embeds.js';

this._consent = new HaxConsentController(this, () => this.source);
render() {
  return this._consent.allowed ? html`<iframe src="${this.source}"></iframe>` : this._consent.gate();
}
```

`gateIframes(root)` from the same file holds back every cross-origin `<iframe>` in content that is not in the page yet; HAXcms runs it on page content before inserting it.

## Develop / Demo

```bash
$ npm start
```

## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
