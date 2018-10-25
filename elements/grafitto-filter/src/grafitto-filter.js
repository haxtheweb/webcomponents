import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
`grafitto-filter` is a Polymer reusable web component providing a solution for filtering a list of items before displaying them.
This component also supports use of custom filter functions using the `f` property. 

Install:
```bash
bower install --save grafitto/grafitto-filter
```

`array`:
```javascript
var array = ["one", "two", "three", "four", "five", "six", "seven"];
```
```html
<grafitto-filter item=[[array]] like="o" as="vitu">
  <template>
    <iron-list items=[[vitu]] as="item">
      <template>
        <div>{{item}}</div>
      </template>
    </iron-list>
  </template> </grafitto-filter>
```
_Note_: When a simple array is provided, the `where` attribute is ignored and filtering done on the array items themselves.
Also an array of numbers behave like an array of strings when filtering.

### Arrays of Objects   
`data`:
```javascript
var data = [
  {
    name:"John",
    home: "Thika"
  },
  {
    name: "Doe",
    home: "Nairobi"
  }
]
```
Example using `dom-repeat`:

```html
<grafitto-filter items='[[data]]' where="name" like="Doe" as="vitu">
  <template>
    <template is="dom-repeat" items=[[vitu]] as="item">
      <div>{{item.name}}</div>
    </template>
  </template>
</grafitto-filter>
```

Example using `iron-list`:

```html
<grafitto-filter items=[[data]] where="name" like="Doe" as="vitu">
  <template>
    <iron-list items=[[vitu]] as="item">
      <template>
        <div>{{item.name}}</div>
      </template>
    </iron-list>
  </template>
</grafitto-filter>
```
Just incase you are wondering, `vitu` means `items` in Swahili :-)

_Note_: When a simple array E.g `["one","two","three","four"]` is provided, the `where` attribute is ignored and filtering done on the array items themselves.

`grafitto-filter` also supports complex objects. consider:


```javascript
var complexObj = [
  {
    name: {
      first: "Thomas",
      second: "Kimtu"
    },
    home: "Thika"
  },
  {
    name: {
      first: "John",
      second: "Doe"
    },
    home: "Othaya"
  },
  {
    name: {
      first: "Clement",
      second: "Wainaina"
    },
    home: "Nakuru"
  }
]
``` 

Here is an example using the `complexObj` object above

```html
<grafitto-filter items=[[complexObj]] where="name.first" like="tho" as="vitu">
  <template>
    <iron-list items=[[vitu]] as="item">
      <template>
        <div>{{item.name.first}} {{item.name.second}}, {{item.home}}</div>
      </template>
    </iron-list>
  </template>
</grafitto-filter>
```

You can also use your custom function to filter the items provided.
The function receives a single `item` of the items provided and should return a `boolean` 

```html
<dom-module id="your-element">
  <template>
    <grafitto-filter items=[[data]] id="filter" as="vitu">
      <template>
        <iron-list items=[[vitu]] as="item">
          <template>
            <div>{{item.name}}, {{item.home}}</div>
          </template>
        </iron-list>
      </template>
    </grafitto-filter>
    <script>
      Polymer({
        is: "your-element",
        properties: {
          data: {
            type: Array,
            value: [
                    {
                      "name":"John",
                      "home": "Thika"
                    },
                    {
                      "name": "Doe",
                      "home": "Nairobi"
                    }
                  ]
          }
        },
        ready: function(){
          this.$.filter.f = function(item){
            return item.name == "Doe";
          };
        }
       //Then you can call filter() function to trigger filter
      })
    </script>
  </template>
</dom-module>
```

### Rule of thumb   
`like` is taken as a regular expression so remember to escape any characters that you don't want interpreted
by the regular expression engine.

@element grafitto-filter
@demo demo/index.html
*/
Polymer({
  _template: `
        <div id="dom">
          <content id="template" select="template"></content>
        </div>
`,

  is: "grafitto-filter",

  properties: {
    /**
     * These are the items to be filtered
     */
    items: {
      type: Array,
      value: []
    },
    /**
     * Filter regular expression string
     */
    like: {
      type: String,
      value: ""
    },
    /**
     * The filter-by field of your items array of objects
     */
    where: {
      type: String,
      value: "name"
    },
    /**
     * Enable case sensitivity when filtering
     */
    caseSensitive: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * How the filtered items will be passed to the light-DOM. Default `items`
     */
    as: {
      type: String,
      value: "items"
    },
    /**
     * Filtered items
     */
    filtered: {
      type: Array,
      computed: "_computeFiltered(items, where, like, caseSensitive)",
      observer: "_onFilter"
    },
    /**
     * Custom filter function, if this is provided then 'where' and 'like' are ignored
     */
    f: {
      type: Function,
      notify: true
    }
  },

  observers: ["_populateUserTemplate(filtered)"],

  behaviors: [Polymer.Templatizer],

  /**
   * Filters the items using the f function provided. Recommended when f function is provided
   */
  filter: function() {
    //This forces _computeFiltered function to do its job :-)
    this.where = "";
  },

  /**
   * This filters the items provided
   *
   * @param {array} items These are the items to be filtered.
   * @param {string} where The filterby string.
   * @param {string} like The filter string.
   * @param {boolean} capital This is a flag to determine whether filter should be case sensitive or not.
   * @return array} Filter results.
   */
  _computeFiltered: function(items, where, like, caseSensitive) {
    var regex = null;
    if (caseSensitive) {
      regex = new RegExp(like);
    } else {
      regex = new RegExp(like, "i");
    }

    var filtered = [];
    if (this.f) {
      var customFunction = this.f.bind(this);
      filtered = items.filter(customFunction);
    } else {
      //Save a reference to this object
      var decompose = this._decomposeWhere.bind(this);
      //Filter by `like`
      filtered = items.filter(function(item) {
        //This is when a complex object is provided
        if (typeof item == "object") {
          //Decompose where incase it is represented in . notation for complex objects
          var decomposed = decompose(where, item);
          //Check if the items specified are defined
          if (typeof decomposed == "undefined") {
            //Do what I know best
            console.warn(
              "grafitto-filter was unable to find a property in '" + where + "'"
            );
          }
          return regex.test(decomposed);
        }

        //When a simple object of strings is provided
        if (typeof item == "string") {
          return regex.test(item);
        }
        //When a simple object of numbers is provided
        if (typeof item == "number") {
          return regex.test(item.toString());
        }
      });
    }
    return filtered;
  },

  /**
   * Populates user template, only template dom-repeate is supported for now
   *@param {array} filtered the filtered array to be displayed
   */
  _populateUserTemplate: function(filtered) {
    this._userTemplate = Polymer.dom(this.$.template).getDistributedNodes()[0];
    if (this._userTemplate) {
      this.templatize(this._userTemplate);
      var clone = this.stamp();
      clone[this.as] = filtered;
      Polymer.dom(this.$.dom).innerHTML = "";
      Polymer.dom(this.$.dom).appendChild(clone.root);
    } else {
      console.warn(
        "grafitto-filter requires a template to be provided in light-dom"
      );
    }
  },

  /**
   * This decomposes `where` property to object attributes using . notation
   */
  _decomposeWhere: function(where, item) {
    return where.split(".").reduce(function(a, b) {
      return a && a[b];
    }, item);
  },

  /**
   * The `filter` event is fired whenever filtering is done before populating the dom.
   *
   * @event filter
   */
  _onFilter: function() {
    this.fire("filter");
  }
});
