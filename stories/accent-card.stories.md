```js script
import '../elements/accent-card.js';

export default {
  title: 'Demo Card/Docs (markdown)',
  parameters: { component: 'accent-card-card' } },
};
```

# Demo Web Component Card

A component meant to display small information with additional data on the back.
// [...] use markdown to format your text
// the following demo is inline

```js story
export const Simple = () => html`
  <accent-card>Hello World</accent-card>
`;
```

## Variations

Show demo with a frame and a "show code" button.

```js preview-story
export const Simple = () => html`
  <accent-card>Hello World</accent-card>
`;
```

## API

The api table will show the data of "accent-card" in your `custom-elements.json`.

<sb-props of="accent-card-card"></sb-props>

// [...]