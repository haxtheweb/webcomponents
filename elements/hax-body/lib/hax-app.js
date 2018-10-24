import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="hax-app">
  <style>
    :host {
      display:none;
    }
  </style>
  <template>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
 `hax-app`
 An app registered with HAX. This provides all the information needed for HAX
 to understand how to talk to this backend as well as represent it in listings.
 It also expresses how to take that data and wire it up to gizmos making it able to
 utilize multiple display methods.

@demo demo/index.html

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
    "tags": ["images", "creative commons", "crowdsourced"]
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

*/
Polymer({
  is: "hax-app",
  properties: {
    /**
     * The data model.
     */
    data: {
      type: Object
    }
  },
  /**
   * ON attached life-cycle, meaning it's in the body most likely, then fire registration.
   */
  attached: function() {
    if (typeof this.data !== typeof undefined) {
      this.fire("hax-register-app", this.data);
    }
  }
});
