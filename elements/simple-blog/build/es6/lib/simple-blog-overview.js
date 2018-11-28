import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@lrnwebcomponents/simple-datetime/simple-datetime.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        outline: none;
        text-transform: none;
      }
      paper-button {
        padding: 0;
        margin: 0;
        width: 100%;
        min-width: unset;
      }
      paper-card {
        padding: 32px 16px;
        margin: 0;
        min-width: unset;
        width: 100%;
        background-color: transparent;
      }
      .post-title {
        letter-spacing: -.32px;
        font-weight: 700;
        font-style: normal;
        display: block;
        font-size: 28px;
        line-height: 1.1;
        margin: 0;
      }
      .post-title a {
        text-decoration: none;
        color: #333332;
      }
      .post-excerpt {
        letter-spacing: -.32px;
        font-weight: 300;
        font-style: normal;
        font-size: 16px;
        line-height: 1.3;
        color: #666665;
      }
      .post-excerpt p {
        text-transform: none;
      }
      :host([elevation="2"]) .post-excerpt,
      :host([elevation="2"]) simple-datetime {
        color: #333335;
      }
      .post-meta {
        font-size: 14px;
        color: #b3b3b1;
        line-height: 30px;
      }
    </style>
    <paper-button>
    <paper-card elevation="[[elevation]]">
    <article class="post" itemtype="http://schema.org/BlogPosting" role="article">
      <div class="article-item">
        <header class="post-header">
          <a tabindex="-1" href\$="[[link]]" itemprop="url"></a>
          <h2 class="post-title" itemprop="name">[[title]]</h2>
        </header>
        <section class="post-excerpt" itemprop="description">
          <p>[[description]]</p>
        </section>
        <div class="post-meta">
          <simple-datetime format="M jS, Y" timestamp="[[changed]]" unix=""></simple-datetime>
        </div>
      </div>
    </article>
    </paper-card>
    </paper-button>
`,
  is: "simple-blog-overview",
  listeners: {
    tap: "_itemTap",
    mousedown: "tapEventOn",
    mouseover: "tapEventOn",
    mouseout: "tapEventOff",
    focusin: "tapEventOn",
    focusout: "tapEventOff"
  },
  properties: {
    itemId: { type: String },
    title: { type: String },
    body: { type: String },
    link: { type: String },
    changed: { type: Number },
    elevation: { type: Number, value: 0, reflectToAttribute: !0 }
  },
  _itemTap: function(e) {
    this.fire("active-item-selected", this.itemId);
  },
  tapEventOn: function(e) {
    this.elevation = 2;
  },
  tapEventOff: function(e) {
    this.elevation = 0;
  }
});
