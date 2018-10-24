import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`simple-blog`
A simple blog and associated elements

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      .teaserimage {
        height: 450px;
        padding: 0;
        margin: 0;
        position: relative;
        overflow: hidden;
        background-color: var(--haxcms-color, black);
      }
      .teaserimage-image {
        transition: all .6s linear;
        background-size: cover;
        background-position: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        text-indent: -9999px;
        transform: translate3d(0px, 24px, 0px);
        opacity: 0.8;
        visibility: visible;
      }
      .teaserimage-image:hover {
        opacity: 1;
      }
      .blog-logo {
        width: 120px;
        height: 120px;
        position: absolute;
        margin-top: -60px;
        right: 50%;
        margin-right: -60px;
        background-size: cover;
        border-radius: 50%;
        z-index: 99;
        text-indent: -9999px;
        border: 3px solid #fff;
        background-color: #fff;
        -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.3);
        -moz-box-shadow: 0 1px 1px rgba(0,0,0,.3);
        box-shadow: 0 1px 1px rgba(0,0,0,.3);
      }
      .blog-title {
        margin: 0;
        padding: 84px 16px 8px;
        font-size: 50px;
        text-align: center;
        font-weight: 700;
        letter-spacing: -2px;
        outline: 0;
        line-height: 50px;
        word-break: break-word;
        color: #333;
      }
      .blog-description {
        margin: 0 0 20px;
        padding: 0 32px;
        font-size: 18px;
        line-height: 1.5;
        color: #666;
        text-align: center;
        font-weight: 400;
      }
      .custom-links {
        margin: 0 0 50px;
        text-align: center;
        color: #ccc;
      }
    </style>
    <div class="teaserimage">
      <div class="teaserimage-image" style\$="background-image: url([[manifest.metadata.image]]);"></div>
    </div>
    <header class="blog-header">
      <iron-icon class="blog-logo" icon="[[manifest.metadata.icon]]"></iron-icon>
      <h1 class="blog-title">[[manifest.title]]</h1>
      <h2 class="blog-description">[[manifest.description]]</h2>
      <div class="custom-links">
      </div>
    </header>
`,

  is: "simple-blog-header",

  properties: {
    /**
     * Manifest, JSON Outline Schema object
     */
    manifest: {
      type: Object
    }
  }
});
