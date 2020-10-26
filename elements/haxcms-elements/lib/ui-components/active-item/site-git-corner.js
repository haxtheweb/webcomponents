import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { varGet } from "@lrnwebcomponents/utils/utils.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";

class SiteGitCorner extends HAXCMSThemeParts(LitElement) {
  static get tag() {
    return "site-git-corner";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          float: var(--site-git-corner-float);
        }
        :host([direction="right"]) {
          float: right;
        }
        :host([direction="left"]) {
          float: left;
        }
        git-corner {
          --github-corner-color: var(--site-git-corner-color);
          --github-corner-background: var(--site-git-corner-background);
        }
      `,
    ];
  }
  render() {
    return html`
      <git-corner
        .part="${this.editMode ? `edit-mode-active` : ``}"
        size="${this.size}"
        alt="${this.alt}"
        ?circle="${this.circle}"
        source="${this.activeGitFileLink}"
      ></git-corner>
    `;
  }
  constructor() {
    super();
    this.circle = false;
    this.alt = "See page source";
    this.direction = "right";
    this.activeGitFileLink = "";
    this.__disposer = [];
    autorun((reaction) => {
      if (
        varGet(store.manifest, "metadata.site.git.publicRepoUrl", "") != "" &&
        !window.customElements.get("git-corner")
      ) {
        import("@lrnwebcomponents/git-corner/git-corner.js");
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      if (store.activeItem) {
        let filePath =
          varGet(store.manifest, "metadata.site.git.publicRepoUrl", "") +
          store.activeItem.location;
        // 11ty has a very unique setting for source vs input
        // @note let's try to do this as little as possible..
        if (window.HAXCMSContext == "11ty") {
          filePath = filePath.replace("/src/./pages/", "/src/content/");
        }
        this.activeGitFileLink = filePath;
      }
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      circle: { type: Boolean },
      size: { type: String },
      activeGitFileLink: { type: String, attribute: "active-git-file-link" },
      direction: { type: String, reflect: true },
      alt: { type: String },
    };
  }
}

window.customElements.define(SiteGitCorner.tag, SiteGitCorner);
export { SiteGitCorner };
