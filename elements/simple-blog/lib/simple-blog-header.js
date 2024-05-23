import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { varGet } from "@haxtheweb/utils/utils.js";
/**
 * `simple-blog-header`
 * `A simple blog header to the front of the site`
 * @element simple-blog-header
 */
class SimpleBlogHeader extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
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
          transition: all 0.6s linear;
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
          -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        }
        .site-title {
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
          margin: 0 auto 36px;
          text-align: center;
          color: #ccc;
          display: flex;
          justify-content: center;
        }
        site-rss-button {
          margin: 0 4px;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-header";
  }
  constructor() {
    super();
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
    );
  }
  // render function
  render() {
    return html`
      <div class="teaserimage">
        <div
          class="teaserimage-image"
          style="background-image: url(${this.image});"
        ></div>
      </div>
      <div class="blog-header">
        <simple-icon class="blog-logo" icon="${this.icon}"></simple-icon>
        ${this.title ? html`<h1 class="site-title">${this.title}</h1>` : ``}
        ${this.title
          ? html`<h2 class="blog-description">${this.description}</h2>`
          : ``}
        <div class="custom-links">
          <site-rss-button type="atom"></site-rss-button>
          <site-rss-button type="rss"></site-rss-button>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      description: {
        type: String,
      },
      image: {
        type: String,
      },
      icon: {
        type: String,
      },
      title: {
        type: String,
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun((reaction) => {
      let manifest = toJS(store.manifest);
      if (manifest && manifest.description) {
        this.description = manifest.description;
      }
      if (manifest && manifest.title) {
        this.title = manifest.title;
      }
      this.image = varGet(
        manifest,
        "metadata.theme.variables.image",
        "assets/banner.jpg",
      );
      this.icon = varGet(
        manifest,
        "metadata.theme.variables.icon",
        "icons:record-voice-over",
      );
      this.author = varGet(manifest, "metadata.author", {});
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
customElements.define(SimpleBlogHeader.tag, SimpleBlogHeader);
export { SimpleBlogHeader };
