# &lt;privacy-choices&gt;

Privacy choices
> Lists every third-party service `HaxConsent` knows (Google Analytics, YouTube, Vimeo, Google Maps, voice input, and any other host a visitor answered on an embed) with the visitor's choice for each, to change or withdraw at any time.

Place it on a site's privacy page. HAXcms links its consent notices to the page with the slug `privacy`, and also opens this element from the user menu for signed-in users. Changes reach open players and gates without a reload.

## Usage

```js
import '@haxtheweb/privacy-choices/privacy-choices.js';
```

```html
<privacy-choices></privacy-choices>
```

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
