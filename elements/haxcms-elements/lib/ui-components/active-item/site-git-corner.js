import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { varGet } from "@lrnwebcomponents/utils/utils.js";

class SiteGitCorner extends LitElement {
  static get tag() {
    return "site-git-corner";
  }
  static get styles() {
    return [
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
      `
    ];
  }
  render() {
    return html`
      <git-corner
        alt="${this.alt}"
        source="${this.activeGitFileLink}"
      ></git-corner>
    `;
  }
  constructor() {
    super();
    this.alt = "See page source";
    this.direction = "right";
    this.activeGitFileLink = "";
    this.__disposer = [];
    autorun(reaction => {
      if (
        varGet(store.manifest, "metadata.site.git.publicRepoUrl", "") != "" &&
        !window.customElements.get("git-corner")
      ) {
        import("@lrnwebcomponents/git-corner/git-corner.js");
      }
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      if (store.activeItem) {
        this.activeGitFileLink =
          varGet(store.manifest, "metadata.site.git.publicRepoUrl", "") +
          store.activeItem.slug;
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
      activeGitFileLink: { type: String, attribute: "active-git-file-link" },
      direction: { type: String, reflect: true },
      alt: { type: String }
    };
  }
}

window.customElements.define(SiteGitCorner.tag, SiteGitCorner);
export { SiteGitCorner };
