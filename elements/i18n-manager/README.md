# &lt;i18n-manager&gt;

18
> internationalization management singleton and helper classes

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/i18n-manager/i18n-manager.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/i18n-manager/i18n-manager.js"></script>
```

## Language registry
`lib/languages.json` is the one list of languages for the whole HAX ecosystem: the installer, the settings panel, per-site language, the SEO language picker, both backends (haxcms-nodejs, haxcms-php) and the `hax` CLI all read it. Edit it here only; `yarn language-registry-sync` copies it into the backends and the CLI (`--check` reports drift).

```js
import { normalizeLanguageCode, matchLanguageCode, isSupportedLanguageCode } from '@haxtheweb/i18n-manager/lib/LanguageRegistry.js';
```

- `matchLanguageCode(value)` returns the registry code for an exact code or alias, never dropping a region, otherwise `null`.
- `normalizeLanguageCode(value)` also accepts OS locales (`en_US.UTF-8`) and falls back to the base language.
- Aliases map legacy or alternate codes to the canonical one: `no`/`nn` to `nb`, `iw` to `he`, `in` to `id`, `ji` to `yi`, `jw` to `jv`, `fil` to `tl`, `zh`/`zh-Hans` to `zh-CN`, `zh-Hant`/`zh-HK`/`zh-MO` to `zh-TW`.

### Behavior change: default language is normalized
The system default language (localization settings) in both backends, and the site language set by `hax create`, are now stored as the canonical registry code. A code or alias in the registry is saved as its canonical code (`no` becomes `nb`, `iw` becomes `he`, `zh_CN` becomes `zh-CN`). A value the registry does not list but that is a well-formed language tag is kept with tidy casing (`fr-ca` becomes `fr-CA`). Anything else is cleared rather than stored. Values that are already canonical are unaffected.

### API
Authenticated, `GET` only, in both backends:
- `/system/api/v1/languages`
- `/system/api/v1/languages/{code}`
- `/system/api/v1/languages/{code}/translations` (`?namespace=`, `?type=all|ui|schema`)

The CLI accepts `--site-lang` on `hax create` and prompts for a site language.

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
```bash
$ npm start
```


## Contributing

1. Fork it! `git clone https://github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

18

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)