/**
 `hax-app`
 An app registered with HAX. This provides all the information needed for HAX
 to understand how to talk to this backend as well as represent it in listings.
 It also expresses how to take that data and wire it up to gizmos making it able to
 utilize multiple display methods.

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax

@example data call
```
{
  "details": {
    "title": "Flickr",
    "icon": "image:collections",
    "image": "flickr.jpg",
    "color": "pink",
    "author": "Yahoo",
    "description": "The original photo sharing platform on the web.",
    "status": "available",
    "rating": "0",
    "tags": ["images"]
  },
  "connection": {
    "protocol": "https",
    "url": "api.flickr.com",
    "headers": {
      "Authorization": "Bearer POTENTIALLYSOMEBIGSIGNATUREHERE"
    },
    "data": {
      "api_key": "SOMEBIGKEYHERE"
    },
    "operations": {
      "browse": {
        "method": "GET",
        "endPoint": "services/rest",
        "pagination": {
          "style": "page",
          "props": {
            "per_page": "photos.perpage",
            "total_pages": "photos.pages",
            "page": "photos.page"
          }
        },
        "search": {
          "text": {
            "title": "Search",
            "type": "textfield"
          },
          "license": {
            "title": "License type",
            "type": "select",
            "options": {
              "1": "Public domain",
              "2": "CC attribution",
              "3": "CC Zero",
              "4": "CC Share-alike"
            }
          }
        },
        "data": {
          "method": "flickr.photos.search",
          "text": "",
          "safe_search": "1",
          "per_page": "20",
          "page": "1",
          "format": "json",
          "nojsoncallback": "1",
          "extras": "license,description,url_l,url_s"
        },
        "resultMap": {
          "defaultGizmoType": "video",
          "items": "resource.items.collection",
          "preview": {
            "title": "Stuff",
            "details": "Details",
            "image": "whatever.jpg",
            "id": "meta.id"
          },
          "gizmo": {
            "type": "",
            "title": "",
            "description": "",
            "source": "",
            "citation": "",
            "alt": "",
            "caption": "",
            "color": ""
          }
        }
      },
      "read": {
        "method": "GET",
        "endPoint": "node/<%= id %>",
        "data": {
          "deep-load-refs": "node"
        }
      },
      "edit": {
        "method": "PUT",
        "endPoint": "node/<%= id %>/update"
      },
      "add": {
        "method": "POST",
        "endPoint": "node",
        "data": {
          "title": "A new item",
          "img": "This is the image"
        }
      },
      "delete": {
        "method": "DELETE",
        "endPoint": "node/<%= id %>/delete"
      }
    }
  }
}
```
 * @element hax-app
 */
class HAXApp extends HTMLElement {
  constructor() {
    super();
    this.eventName = "hax-register-app";
  }
  static get tag() {
    return "hax-app";
  }
  /**
   * Connected life cycle
   */
  connectedCallback() {
    if (typeof this.data !== typeof undefined) {
      // account for possibly needing to convert string to data object
      if (typeof this.data === "string") {
        this.data = JSON.parse(this.data);
      }
      this.dispatchEvent(
        new CustomEvent(this.eventName, {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this.data,
        }),
      );
    }
  }
}
customElements.define(HAXApp.tag, HAXApp);

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
    "author": "HAXTheWeb core team",
    "description": "A well organized example list of objectives.",
    "status": "available",
    "rating": "0",
    "tags": ["Instructional", "list"]
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
 * @element hax-stax
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
customElements.define(HAXStax.tag, HAXStax);
export { HAXApp, HAXStax };
