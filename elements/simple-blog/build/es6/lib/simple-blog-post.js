import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        min-height: 80vh;
      }
      main {
        transition: opacity 1s linear, visibility .6s linear;
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        opacity: 1;
        visibility: visible;
      }
      @media only screen and (max-width: 800px) {
        main {
          padding: 0 32px;
        }
      }
      article {
        padding: 40px 0;
      }
      section {
        width: 100%;
        font-family: Linux Libertine;
        color: #333;
      }
      section ::slotted(*) {
        font-weight: 400;
        font-style: normal;
        font-size: 22px;
        line-height: 30px;
        margin: 0;
        padding-bottom: 30px;
        color: #333;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        hyphens: auto;
      }
      :host[has-image] .article-image {
        position: absolute;
        background-color: var(--haxcms-color, black);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
      }
      .post-image-image {
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-indent: -9999px;
        padding-top: 33%;
        z-index: 1;
      }
      .post-meta {
        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;
        padding-top: 60px;
      }
      :host[has-image] .post-meta {
        position: absolute;
        bottom: 80px;
        left: 30%;
        right: 30%;
        z-index: 9;
        font-family: Open Sans,MundoSans,"Helvetica Neue",Arial,Helvetica,sans-serif;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      .post-title {
        font-weight: 700;
        font-style: normal;
        letter-spacing: -.04em;
        font-size: 50px;
        line-height: 1.1;
        color: black;
      }
      :host[has-image] .post-title {
        color: white;
        margin-bottom: 16px;
        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);
      }
      /**
       * Hide the slotted content during edit mode
       */
      :host[edit-mode] #slot {
        display: none;
      }
    </style>
    <main>
      <article>
        <div class="article-image">
        <template is="dom-if" if="[[hasImage]]">
          <div id="image" class="post-image-image" style\$="background-image: url(&quot;[[activeItem.metadata.image]]&quot;);"></div>
        </template>
          <div class="post-meta">
            <h1 class="post-title">[[activeItem.title]]</h1>
          </div>
        </div>
        <section id="contentcontainer">
          <div id="slot">
            <slot></slot>
          </div>
        </section>
      </article>
    </main>
`,
  is: "simple-blog-post",
  properties: {
    activeItem: { type: Object, notify: !0 },
    hasImage: {
      type: Boolean,
      computed: "_computeHasImage(activeItem)",
      observer: "_hasImageChanged",
      reflectToAttribute: !0
    },
    editMode: { type: Boolean, reflectToAttribute: !0, value: !1 }
  },
  ready: function() {
    window.addEventListener("scroll", this._scrollListener.bind(this));
  },
  detached: function() {
    window.removeEventListener("scroll", this._scrollListener.bind(this));
  },
  _scrollListener: function() {
    if (this.hasImage) {
      let top =
        (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
      if (0 > top || 1500 < top) {
        return;
      }
      this.shadowRoot.querySelector("#image").style.transform =
        "translate3d(0px, " + top / 3 + "px, 0px)";
      this.shadowRoot.querySelector("#image").style.opacity =
        1 - Math.max(top / 700, 0);
    }
  },
  _hasImageChanged: function(newValue) {
    if (newValue) {
      async.microTask.run(() => {
        let rect = this.shadowRoot
          .querySelector("#image")
          .getBoundingClientRect();
        this.$.contentcontainer.style.paddingTop = rect.height + "px";
      });
    } else {
      this.$.contentcontainer.style.paddingTop = null;
    }
  },
  _computeHasImage: function(activeItem) {
    if (
      typeof activeItem.metadata !== typeof void 0 &&
      typeof activeItem.metadata.image !== typeof void 0
    ) {
      return !0;
    }
    return !1;
  }
});
