# \<monaco-element\>

Webcomponent wrapper for the monaco editor implementing basic functionality.

[![GitHub license](https://img.shields.io/github/license/Larsg7/monaco-element.svg)](https://github.com/Larsg7/monaco-element/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/monaco-element.png?compact=true)](https://nodei.co/npm/monaco-element/)

[DEMO](https://larsg7.github.io/monaco-element/build/default/)

## Installation

```
yarn install monaco-element
```

## Usage (Polymer 3)

```js
import 'monaco-element';

...

<monaco-element
  value="print('Hello World')"
  language="python"
  theme="vs-light"
  on-value-changed="handleEvent">
</monaco-element>
```

## Caveats

Monaco Editor only works in light DOM, to make it work inside a custom component an `iframe` is created which loads `loader.js` (usually found in `node_modules/monaco-editor/min/vs`). When using this component `<libPath>/loader.js` has to be accessible.

### Polymer

Add `node_modules/monaco-editor/min/**` to your `extraDependencies` in `polymer.json` to make the script available on `polymer build`.

### Angular 6

Add this to the `assets` section of your `angular.json`:

```
{
  "glob": "**/*",
  "input": "./node_modules/monaco-editor/min/vs/",
  "output": "/node_modules/monaco-editor/min/vs/"
}
```

## Acknowledgements

Inspired by [PolymerVis/monaco-editor](https://github.com/PolymerVis/monaco-editor)

## Licence

[MIT](https://github.com/Larsg7/monaco-element/blob/master/LICENSE)
