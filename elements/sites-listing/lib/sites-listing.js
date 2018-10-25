import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./site-card.js";
/**
`sites-listing`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      iron-list {
        flex: 1 1 auto;
      }
      #loading {
        width:100%;
        z-index: 1000;
        opacity: .8;
        padding: 16px;
        text-align: center;
        align-content: center;
        justify-content: center;
        height: 100vh;
        position: absolute;
        background-color: rgba(250, 250, 250, .8);
        transition: all linear .8s;
        visibility: visible;
      }
      #loading div {
        font-size: 32px;
        font-weight: bold;
        padding: 16px;
      }
      #loading[data-loading] {
        background-color: rgba(0, 0, 0, 0);
        opacity: 0;
        visibility: hidden;
      }
      site-card {
        padding: 16px;
      }
      paper-button.site-card-wrapper {
        margin: 0;
        padding: 0;
      }
    </style>
    <iron-ajax auto="" loading="{{__loading}}" url="[[dataSource]]" handle-as="json" debounce-duration="250" last-response="{{sites}}"></iron-ajax>
    <div id="loading" data-loading\$="[[!__loading]]">
      <elmsln-loading></elmsln-loading>
      <div>Loading..</div>
    </div>
    <iron-list items="[[sites]]" as="site" grid="">
      <template>
        <paper-button tabindex="-1" data-site-id\$="[[site.id]]" class="site-card-wrapper" on-tap="_siteClicked">
          <site-card data-site-id\$="[[site.id]]" size="[[size]]" image="[[site.image]]" icon="[[site.icon]]" name="[[site.name]]" title="[[site.title]]" elevation="2"></site-card>
        </paper-button>
      </template>
    </iron-list>
`,

  is: "sites-listing",

  properties: {
    /**
     * Array of site objects
     */
    sites: {
      type: Array
    },
    /**
     * Size of the cards
     */
    size: {
      type: String,
      value: "large"
    },
    /**
     * Data Source to power the loading of sites in JSON Outline Schema format.
     */
    dataSource: {
      type: String
    }
  },

  /**
   * Handle tap on paper-button above to redirect to the correct data.
   */
  _siteClicked: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current course
    var active = local.getAttribute("data-site-id");
    // find the course by it's unique id and filter just to it
    let findSite = this.sites.filter(site => {
      if (site.id !== active) {
        return false;
      }
      return true;
    });
    // if we found one, make it the top level item
    if (findSite.length > 0) {
      findSite = findSite.pop();
    }
    // double check we have a URI
    if (typeof findSite.location !== typeof undefined) {
      window.location.href = findSite.location;
    }
  }
});
