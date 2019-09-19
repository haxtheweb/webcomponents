/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";

/**
 * `learn-two-theme`
 * `Learn2 theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LearnTwoTheme extends HAXCMSTheme(PolymerElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    import("@lrnwebcomponents/simple-colors/simple-colors.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/app-layout/app-drawer-layout/app-drawer-layout.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "learn-two-theme";
  }
  connectedCallback() {
    super.connectedCallback();
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
      this.activeGitFileLink =
        varGet(store.manifest, "metadata.site.git.publicRepoUrl", "") +
        store.activeItem.location;
      this.__disposer.push(reaction);
    });
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    let props = super.properties;
    props.opened = {
      type: Boolean,
      reflectToAttribute: true
    };
    props.cd = {
      type: String
    };
    return props;
  }
  toggleDrawer(e) {
    this.shadowRoot.querySelector("app-drawer").toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };
