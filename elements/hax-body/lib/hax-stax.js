import { HAXApp } from "./hax-app.js";
/**
 `hax-stax`
Register a stax with HAX store.
@microcopy - the mental model for this element
 - stax - a stack of haxElement definitions that are named. Similar to a template in WYSIWYGs.
 - data - this is the stax data model which expresses itself to hax

@example data call
```
[{
  "details": {
    "title": "Example text and meme",
    "image": "example-meme.jpg",
    "author": "ELMS:LN",
    "description": "A well organized example list of objectives.",
    "status": "available",
    "rating": "0",
    "tags": ["instructional design", "list"]
  },
  "stax": [
    {
      "tag": "p",
      "properties": {},
      "content": "It is an ethical imperative that we seek the fundamental transformation of higher education to maximize quality and access to knowledge. This transformation will empower the globe to increase empathy, maximize personal freedom and personal growth through increased educational equality."
    },
    {
      "tag": "meme-maker",
      "properties": {
        "image-url": "https://media1.giphy.com/media/3o7TKMOy5zz1nuD71u/giphy.gif",
        "alt": "sun moon GIF by Amy Ciavolino",
        "top-text": "Sup, suuuuuun?",
        "bottom-text": "Hax, Moon. Hax."
      },
      "content": ""
    }
  ]
}]
```
 * @customElement hax-stax
 */
class HAXStax extends HAXApp {
  constructor() {
    super();
    this.eventName = "hax-register-stax";
  }
  static get tag() {
    return "hax-stax";
  }
}
window.customElements.define(HAXStax.tag, HAXStax);
export { HAXStax };
